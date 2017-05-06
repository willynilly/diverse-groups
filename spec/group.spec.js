let _ = require('lodash');
let Group = require('../group');
let Individual = require('../individual');

describe('Group', () => {

	let group;
	let featureCount = 10;
	let minGroupSize = 3;
	let maxGroupSize = 6;

	beforeEach(() => {
		group = new Group(featureCount, minGroupSize, maxGroupSize);
	})

	describe('#canRemoveIndividual()', () => {
		it('should return true if the group individual count is greater than the min group size', () => {
			group.individuals = _.times(5, (i) => {
				return new Individual(i);
			});
			expect(group.canRemoveIndividual()).toBe(true);
		})
		it('should return false if the group individual count is less than the min group size', () => {
			group.individuals = _.times(3, (i) => {
				return new Individual(i);
			});
			expect(group.canRemoveIndividual()).toBe(false);
		})
		it('should return false if the group individual count is equal to the min group size', () => {
			group.individuals = _.times(2, (i) => {
				return new Individual(i);
			});
			expect(group.canRemoveIndividual()).toBe(false);
		})
	})

	describe('#canAddIndividual()', () => {
		it('should return true if the group individual count is less than the max group size', () => {
			group.individuals = _.times(5, (i) => {
				return new Individual(i);
			});
			expect(group.canAddIndividual()).toBe(true);
		})
		it('should return false if the group individual count is greater than the max group size', () => {
			group.individuals = _.times(7, (i) => {
				return new Individual(i);
			});
			expect(group.canAddIndividual()).toBe(false);
		})
		it('should return false if the group individual count is equal to the max group size', () => {
			group.individuals = _.times(6, (i) => {
				return new Individual(i);
			});
			expect(group.canAddIndividual()).toBe(false);
		})
	})

	describe('#getZeroIndividual()', () => {

		it('should return a zero vector with the id of "zero"', () => {
			let zeroIndividual = group.getZeroIndividual();
			expect(zeroIndividual.id).toEqual('zero');
		})

		it('should return an individual whose features array length featureCount', () => {
			let zeroIndividual = group.getZeroIndividual();
			expect(zeroIndividual.features.length).toEqual(featureCount);
		})

		it('should return an individual whose features are all zero', () => {
			let zeroIndividual = group.getZeroIndividual();
			let outliers = _.filter(zeroIndividual.features, (v) => {
				return v !== 0;
			});
			expect(outliers.length).toEqual(0);
		})

	})


})
