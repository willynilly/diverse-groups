// let Community = require('../community');
// let _ = require('lodash');
//
// describe('Community', () => {
//
// 	let community;
// 	let groups;
//
// 	beforeEach(() => {
//
// 	})
//
// 	describe('#moveRandomIndividualBetweenGroups(fromGroup, toGroup)', () => {
//
// 		it('should remove an element from fromGroup and add it to toGroup', () => {
// 			let fromGroup = groups[0];
// 			let toGroup = groups[1];
//
// 			let beforeAllElements = _.concat(fromGroup, toGroup);
//
// 			expect(fromGroup.length).toBe(3);
// 			expect(toGroup.length).toBe(1);
// 			gm.moveRandomIndividualBetweenGroups(fromGroup, toGroup);
// 			expect(fromGroup.length).toBe(2);
// 			expect(toGroup.length).toBe(2);
//
// 			let afterAllElements = _.concat(fromGroup, toGroup);
// 			let newElements = _.difference(beforeAllElements, afterAllElements);
// 			expect(newElements).toEqual([]);
//
// 		})
//
// 		it('should not remove any element if fromGroup is empty', () => {
// 			let fromGroup = [];
// 			let toGroup = groups[1];
//
// 			let beforeAllElements = _.concat(fromGroup, toGroup);
//
// 			expect(fromGroup.length).toBe(0);
// 			expect(toGroup.length).toBe(1);
// 			gm.moveRandomIndividualBetweenGroups(fromGroup, toGroup);
// 			expect(fromGroup.length).toBe(0);
// 			expect(toGroup.length).toBe(1);
//
// 			let afterAllElements = _.concat(fromGroup, toGroup);
//
// 			let newElements = _.difference(beforeAllElements, afterAllElements);
// 			expect(newElements).toEqual([]);
// 		})
//
// 	})
//
// 	describe('#getAllIndividualsFromGroups(groups)', () => {
// 		it('should return an array with all inds from groups', () => {
// 			let expectedAllIndividuals = [
// 				[1, 1, 1],
// 				[2, 2, 2],
// 				[3, 3, 3],
// 				[4, 4, 4]
// 			];
// 			let allIndividuals = gm.getAllIndividualsFromGroups(groups);
// 			expect(allIndividuals).toEqual(expectedAllIndividuals);
// 		})
//
// 		it('should return zero ind if there are no inds in a group', () => {
// 			let group = [];
// 			let sumIndividual = gm.getSumIndividualFromGroup(group);
// 			expect(sumIndividual).toEqual([0, 0, 0])
// 		})
// 	})
//
// 	describe('#crossoverGroup(groupA, groupB, usedIndividuals)', () => {
// 		it('should return a group that does not have any usedIndividuals', () => {
// 			let usedIndividuals = [
// 				[1, 1, 1],
// 				[2, 2, 2]
// 			];
// 			let groupA = [
// 				[0, 0, 0],
// 				[1, 1, 1]
// 			];
// 			let groupB = [
// 				[3, 3, 3],
// 				[2, 2, 2]
// 			];
// 			let group = gm.crossoverGroup(groupA, groupB, usedIndividuals);
//
// 			expect(_.intersection(group, usedIndividuals)).toEqual([]);
// 		})
//
// 	})
//
// 	describe('#getSumIndividualFromGroup(group)', () => {
// 		it('should sum all the inds in a group', () => {
// 			let group = groups[0];
// 			let sumIndividual = gm.getSumIndividualFromGroup(group);
// 			expect(sumIndividual).toEqual([6, 6, 6])
// 		})
//
// 		it('should return zero ind if there are no inds in a group', () => {
// 			let group = [];
// 			let sumIndividual = gm.getSumIndividualFromGroup(group);
// 			expect(sumIndividual).toEqual([0, 0, 0])
// 		})
// 	})
//
//
// 	describe('#getAverageIndividualFromGroup(group)', () => {
// 		it('should sum all the inds in a group and divide by the number of inds in group', () => {
// 			let group = groups[0];
// 			let averageIndividual = gm.getAverageIndividualFromGroup(group);
// 			expect(averageIndividual).toEqual([2, 2, 2])
// 		})
//
// 		it('should return zero ind if there are no inds in a group', () => {
// 			let group = [];
// 			let averageIndividual = gm.getAverageIndividualFromGroup(group);
// 			expect(averageIndividual).toEqual([0, 0, 0])
// 		})
// 	})
//
//
// 	describe('#getScoreForGroup(group)', () => {
// 		it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
// 			let group = [
// 				[1, 0, 0],
// 				[2, 0, 0],
// 				[3, 0, 0]
// 			];
// 			let score = gm.getScoreForGroup(group);
// 			let expectedScore = 2;
// 			expect(score).toEqual(expectedScore);
// 		})
//
// 		it('should return zero if there are no inds in a group', () => {
// 			let group = [];
// 			let score = gm.getScoreForGroup(group);
// 			let expectedScore = 0;
// 			expect(score).toEqual(expectedScore);
// 		})
//
// 		it('should return zero if there is a single ind in a group', () => {
// 			let group = [
// 				[1, 1, 1]
// 			];
// 			let score = gm.getScoreForGroup(group);
// 			let expectedScore = 0;
// 			expect(score).toEqual(expectedScore);
// 		})
// 	})
//
// 	describe('#getIndividualDistance(indA, indB)', () => {
// 		it('should return the Euclidean distance between two inds', () => {
// 			let indA = [3, 0, 0];
// 			let indB = [0, 4, 0];
// 			let distance = gm.getIndividualDistance(indA, indB);
// 			let expectedDistance = 5;
// 			expect(distance).toEqual(expectedDistance);
// 		})
// 	})
//
// 	describe('#createRandomIndividual(indDimSize, minValue, maxValue)', () => {
// 		it('should return a ind with dimension of indDimSize, where each value is between minValue and maxValue inclusive', () => {
// 			let indDimSize = 9;
// 			let minValue = -1;
// 			let maxValue = 10;
// 			let ind = gm.createRandomIndividual(indDimSize, minValue, maxValue);
// 			expect(ind.length).toEqual(indDimSize);
// 			_.forEach(ind, (value) => {
// 				expect(value <= maxValue && value >= minValue).toBe(true);
// 			})
// 		})
// 	})
//
// 	describe('#fitness(groups)', () => {
// 		it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
// 			let groups = [
// 				[
// 					[1, 0, 0],
// 					[2, 0, 0],
// 					[3, 0, 0]
// 				],
// 				[
// 					[0, 1, 0],
// 					[0, 2, 0],
// 					[0, 3, 0]
// 				]
// 			];
// 			let score = gm.fitness(groups);
// 			let expectedScore = 4;
// 			expect(score).toEqual(expectedScore);
// 		})
//
// 		it('should return zero if there are no groups', () => {
// 			let groups = [];
// 			let score = gm.fitness(groups);
// 			let expectedScore = 0;
// 			expect(score).toEqual(expectedScore);
// 		})
// 	})
//
// 	describe('#crossover(groupA, groupB)', () => {
// 		it('should return an array with two groups', () => {
// 			let groupA = groups[0];
// 			let groupB = groups[1];
// 			let result = gm.crossover(groupA, groupB);
// 			expect(result.length).toEqual(2);
// 		})
// 	})
//
// })
