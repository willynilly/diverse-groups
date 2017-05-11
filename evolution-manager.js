const GA = require('geneticalgorithm');
const _ = require('lodash');
const Community = require('./community');
const Group = require('./group');
const Individual = require('./individual');

class EvolutionManager {

	constructor() {}

	setPopulation(communities, maxCommunityCount) {
		this.communities = communities;

		let config = {

			mutationFunction: _.bind(this.mutate, this),
			crossoverFunction: _.bind(this.crossover, this),
			fitnessFunction: _.bind(this.fitness, this),
			//doesABeatBFunction: doesABeatBFunction,
			population: communities,
			populationSize: maxCommunityCount
		}

		this.ga = GA(config);
	}

	createRandomCommunities(communityCount, groups) {
		let communities = _.times(communityCount, () => {
			let community = new Community();
			community.addGroups(groups);
			community.shuffleIndividualsAcrossGroups();
			return community;
		});
		return communities;
	}

	createRandomGroups(groupCount, featureCount, minGroupSize, maxGroupSize, individuals) {
		let groups = this.createRandomEmptyGroups(groupCount, featureCount, minGroupSize, maxGroupSize);
		let leftOverGroup = this.randomlyAssignIndividualsToGroups(individuals, groups);
		groups.push(leftOverGroup);
		return groups;
	}

	createRandomEmptyGroups(groupCount, featureCount, minGroupSize, maxGroupSize) {
		let groupMinSize = Math.min(minGroupSize, maxGroupSize);
		let groupMaxSize = Math.max(minGroupSize, maxGroupSize);
		let groups = _.times(groupCount, (i) => {
			let groupMinSize = _.random(minGroupSize, maxGroupSize);
			let groupMaxSize = _.random(groupMinSize, maxGroupSize);
			let groupName = i + '';
			return new Group(groupName, featureCount, groupMinSize, groupMaxSize);
		});
		return groups;
	}

	randomlyAssignIndividualsToGroups(individuals, groups) {
		let leftOverIndividuals = _.shuffle(individuals);
		let randomlySortedGroupIndexes = _.shuffle(_.range(groups.length));
		_.forEach(randomlySortedGroupIndexes, (groupIndex) => {
			let group = groups[groupIndex];
			let canAddIndividualCount = group.getCanAddIndividualCount();
			let individualCount = Math.min(_.random(1, canAddIndividualCount), leftOverIndividuals.length);
			let groupIndividuals = _.take(leftOverIndividuals, individualCount);
			leftOverIndividuals = _.takeRight(leftOverIndividuals, leftOverIndividuals.length - individualCount);
			group.addIndividuals(groupIndividuals);
		});

		let totalIndividualCount = _.reduce(groups, (count, group) => {
			return count + group.individuals.length
		}, 0) + leftOverIndividuals.length;


		let featureCount = 0;
		if (groups.length > 0) {
			featureCount = groups[0].featureCount;
		}

		let leftOverGroup = new Group('leftover', featureCount, 0, totalIndividualCount);
		leftOverGroup.addIndividuals(leftOverIndividuals);
		return leftOverGroup;
	}

	createRandomIndividuals(individualCount, featureCount, minFeatureValue, maxFeatureValue) {
		let individuals = _.times(individualCount, (i) => {
			let individual = new Individual(i);
			individual.randomize(featureCount, minFeatureValue, maxFeatureValue);
			return individual;
		});
		return individuals;
	}

	evolve(generationCount, shouldPrintBest) {
		_.times(generationCount, () => {
			this.ga = this.ga.evolve();
			if (shouldPrintBest) {
				this.printBest();
			}
		});
	}

	getBestScore() {
		return this.ga.bestScore();
	}

	getBestSolution() {
		let communityJsonObject = this.ga.best();
		return this.getCommunityFromJsonObject(communityJsonObject);
	}

	printBest() {
		let bestScore = this.getBestScore();
		let community = this.getBestSolution();

		let features = community.getAllFeatures();

		console.log('best score', bestScore);
		console.log('best solution', features);
	}

	getScoreForGroup(group) {
		if (group.length === 0) {
			return 0;
		}
		let averageIndividual = group.getAverageIndividual();
		let score = _.reduce(group.individuals, (totalDistance, individual) => {
			return totalDistance + averageIndividual.distance(individual);
		}, 0);
		return score;
	}

	getCommunityFromJsonObject(communityJsonObject) {
		let community = new Community();
		community.fromJsonObject(communityJsonObject);
		return community;
	}

	mutate(communityJsonObject) {
		let community = this.getCommunityFromJsonObject(communityJsonObject);
		let shouldSwapDisplacedIndividual = true;
		community.moveRandomIndividualToAnotherRandomGroup(shouldSwapDisplacedIndividual);
		return community;
	}

	crossoverGroup(groupA, groupB, leftOverGroup) {
		let overrideSizeConstraints = true;
		let iGroup = groupA.getIntersectionGroup(groupB);
		let dGroup = groupA.getDifferenceGroup(groupB);
		let canAddIndividualCount = iGroup.getCanAddIndividualCount();
		if (canAddIndividualCount > 0) {
			let randomSubGroup = dGroup.removeRandomSubGroup(canAddIndividualCount, overrideSizeConstraints);
			iGroup.addGroup(randomSubGroup, overrideSizeConstraints);
			canAddIndividualCount = iGroup.getCanAddIndividualCount();
			if (canAddIndividualCount > 0) {
				let randomSubGroup = leftOverGroup.removeRandomSubGroup(canAddIndividualCount, overrideSizeConstraints);
				iGroup.addGroup(randomSubGroup, overrideSizeConstraints);
			}
		}
		leftOverGroup.addGroup(dGroup, overrideSizeConstraints);
		return iGroup;
	}

	crossover(communityAJsonObject, communityBJsonObject) {
		let communityA = this.getCommunityFromJsonObject(communityAJsonObject);
		let communityB = this.getCommunityFromJsonObject(communityBJsonObject);

		let groupsA = communityA.groups;
		let groupsB = communityB.groups;
		let allIndividuals = communityA.getAllIndividuals();
		let individualCount = allIndividuals.length;
		let featureCount = 0;
		if (individualCount > 0) {
			featureCount = allIndividuals[0].features.length;
		}
		let leftOverGroup = new Group('left', featureCount, individualCount, individualCount);

		if (groupsA.length === groupsB.length) {
			let groupsC = [];
			let groupIndexes = _.shuffle(_.range(groupsA.length));
			_.forEach(groupIndexes, (i) => {
				let groupA = groupsA[i];
				let groupB = groupsB[i];
				let groupC = this.crossoverGroup(groupA, groupB, leftOverGroup);
				groupsC.push(groupC);
			});
			let communityC = new Community();
			communityC.groups = groupsC;
			return [communityC, communityC];
		} else {
			return [communityA, communityB];
		}
	}

	fitness(communityJsonObject) {
		let community = this.getCommunityFromJsonObject(communityJsonObject);
		return _.reduce(community.groups, (totalScore, group) => {
			return totalScore + this.getScoreForGroup(group);
		}, 0);
	}
}

module.exports = EvolutionManager;
