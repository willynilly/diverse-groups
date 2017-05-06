const GA = require('geneticalgorithm');
const _ = require('lodash');
const Community = require('./community');
const Group = require('./group');

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

	createRandomCommunities(communityCount, groupSizes, featureCount, minFeatureValue, maxFeatureValue) {
		let communities = _.times(communityCount, () => {
			let community = new Community();
			community.addRandomGroups(groupSizes, featureCount, minFeatureValue, maxFeatureValue)
			return community;
		});
		return communities;
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
		community.moveRandomIndividualBetweenTwoRandomGroups();
		return community;
	}

	crossoverGroup(groupA, groupB, leftOverGroup) {
		let iGroup = groupA.getIntersectionGroup(groupB);
		let dGroup = groupA.getDifferenceGroup(groupB);
		let canAddIndividualCount = iGroup.getCanAddIndividualCount();
		if (canAddIndividualCount > 0) {
			let randomSubGroup = dGroup.removeRandomSubGroup(canAddIndividualCount);
			iGroup.addGroup(randomSubGroup);

			canAddIndividualCount = iGroup.getCanAddIndividualCount();
			if (canAddIndividualCount > 0) {
				let randomSubGroup = leftOverGroup.removeRandomSubGroup(canAddIndividualCount);
				iGroup.addGroup(randomSubGroup);
			}
		}
		leftOverGroup.addGroup(dGroup);
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
		let leftOverGroup = new Group(featureCount, individualCount, individualCount);

		if (groupsA.length === groupsB.length) {
			let groupsC = [];
			let groupIndexes = _.shuffle(_.range(groupsA.length))
			_.forEach(groupIndexes, (i) => {
				let groupA = groupsA[i];
				let groupB = groupsB[i];
				let group = this.crossoverGroup(groupA, groupB, leftOverGroup);
				groupsC.push(group);
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
