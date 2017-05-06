let EvolutionManager = require('../evolution-manager');
let Group = require('../group');
let Individual = require('../individual');

let _ = require('lodash');

describe('EvolutionManager', () => {

	let em;
	let communities;
	let populationSize = 100;
	let groupSizes = [2, 2, 5];
	let featureCount = 2;
	let minFeatureValue = 0;
	let maxFeatureValue = 3;

	beforeEach(() => {
		em = new EvolutionManager(populationSize, groupSizes, featureCount, minFeatureValue, maxFeatureValue);
		communities = em.population;
	})

	describe('#mutate(communityJsonObject)', () => {
		it('should return a community with the same number of individuals', () => {
			let communityA = communities[0];
			let resultCommunity = em.mutate(communityA);
			let individualCount = resultCommunity.getAllIndividuals().length;
			let expectedIndividualCount = _.sum(groupSizes);
			expect(individualCount).toEqual(expectedIndividualCount)
		})

		it('should return a community with the same number of groups', () => {
			let communityA = communities[0];
			let resultCommunity = em.mutate(communityA);
			let groupCount = resultCommunity.groups.length;
			let expectedGroupCount = groupSizes.length;
			expect(groupCount).toEqual(expectedGroupCount)
		})


		// it('should return a community where a random individual from a random group A is moved to another random group B, and if B is full, it should have a random individual from B moved to A', () => {
		// 	let communityA = communities[0];
		// 	let result = em.mutate(communityA);
		//
		// })
	})

	describe('#crossover(communityA, communityB)', () => {

		let communityA, communityB;

		beforeEach(() => {
			communityA = communities[0];
			communityB = communities[1];
		})

		it('should return two communities with the same number of individuals', () => {
			let resultCommunities = em.crossover(communityA, communityB);
			let expectedIndividualCount = _.sum(groupSizes);
			let individualCountA = resultCommunities[0].getAllIndividuals().length;
			let individualCountB = resultCommunities[1].getAllIndividuals().length;
			expect(individualCountA).toEqual(expectedIndividualCount);
			expect(individualCountB).toEqual(expectedIndividualCount);
		})

		it('should return two communities with the same number of groups', () => {
			let resultCommunities = em.crossover(communityA, communityB);
			let expectedGroupCount = groupSizes.length;
			let individualCountA = resultCommunities[0].groups.length;
			let individualCountB = resultCommunities[1].groups.length;
			expect(individualCountA).toEqual(expectedGroupCount);
			expect(individualCountB).toEqual(expectedGroupCount);
		})

		it('should return an array with two communities', () => {
			let resultCommunities = em.crossover(communityA, communityB);
			expect(resultCommunities.length).toEqual(2);
		})
	})

	describe('#crossoverGroup(groupA, groupB, leftOverGroup)', () => {
		it('should return a group that has the intersection of groupA and groupB', () => {
			let leftOverGroup = new Group(3, 1, 1);
			let individual5 = new Individual('5', [5, 5, 5]);
			leftOverGroup.addIndividual(individual5);

			let individual0 = new Individual('0', [0, 0, 0]);
			let individual2 = new Individual('2', [2, 2, 2]);
			let individual3 = new Individual('3', [3, 3, 3]);

			let sharedIndividual1 = new Individual('1', [1, 1, 1]);
			let sharedIndividual6 = new Individual('6', [6, 6, 6]);

			let groupA = new Group(3, 3, 3);
			groupA.addIndividual(individual0)
			groupA.addIndividual(sharedIndividual1);
			groupA.addIndividual(sharedIndividual6);

			let groupB = new Group(3, 4, 4);
			groupB.addIndividual(individual3)
			groupB.addIndividual(individual2)
			groupB.addIndividual(sharedIndividual1);
			groupB.addIndividual(sharedIndividual6);

			let groupC = em.crossoverGroup(groupA, groupB, leftOverGroup);
			expect(groupC.containsIndividual(sharedIndividual1)).toEqual(true);
			expect(groupC.containsIndividual(sharedIndividual6)).toEqual(true);

		})

	})

	// describe('#getScoreForGroup(group)', () => {
	// 	it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
	// 		let group = [
	// 			[1, 0, 0],
	// 			[2, 0, 0],
	// 			[3, 0, 0]
	// 		];
	// 		let score = gm.getScoreForGroup(group);
	// 		let expectedScore = 2;
	// 		expect(score).toEqual(expectedScore);
	// 	})
	//
	// 	it('should return zero if there are no inds in a group', () => {
	// 		let group = [];
	// 		let score = gm.getScoreForGroup(group);
	// 		let expectedScore = 0;
	// 		expect(score).toEqual(expectedScore);
	// 	})
	//
	// 	it('should return zero if there is a single ind in a group', () => {
	// 		let group = [
	// 			[1, 1, 1]
	// 		];
	// 		let score = gm.getScoreForGroup(group);
	// 		let expectedScore = 0;
	// 		expect(score).toEqual(expectedScore);
	// 	})
	// })
	//
	// describe('#fitness(communityJsonObject)', () => {
	// 	it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
	// 		let groups = [
	// 			[
	// 				[1, 0, 0],
	// 				[2, 0, 0],
	// 				[3, 0, 0]
	// 			],
	// 			[
	// 				[0, 1, 0],
	// 				[0, 2, 0],
	// 				[0, 3, 0]
	// 			]
	// 		];
	// 		let score = gm.fitness(groups);
	// 		let expectedScore = 4;
	// 		expect(score).toEqual(expectedScore);
	// 	})
	//
	// 	it('should return zero if there are no groups', () => {
	// 		let groups = [];
	// 		let score = gm.fitness(groups);
	// 		let expectedScore = 0;
	// 		expect(score).toEqual(expectedScore);
	// 	})
	// })



})
