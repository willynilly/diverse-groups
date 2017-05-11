let _ = require('lodash');
let Group = require('../group');
let Individual = require('../individual');
let IndividualFactory = require('../individual-factory');

describe('Group', () => {

	let group;
	let id = 'somegroup';
	let featureCount = 10;
	let minGroupSize = 3;
	let maxGroupSize = 6;
	let individualFactory = new IndividualFactory();

	beforeEach(() => {
		group = new Group(id, featureCount, minGroupSize, maxGroupSize);
	})

	describe('#Group(id, featureCount, minGroupSize, maxGroupSize)', () => {
		it('should set the name', () => {
			expect(group.id).toEqual(id);
		});

		it('should set the featureCount', () => {
			expect(group.featureCount).toEqual(featureCount);
		});

		it('should set the minGroupSize', () => {
			expect(group.minSize).toEqual(minGroupSize);
		});

		it('should set the maxGroupSize', () => {
			expect(group.maxSize).toEqual(maxGroupSize);
		});
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

	describe('#addIndividuals(individuals, overrideSizeConstraints)', () => {

		let individuals;

		beforeEach(() => {
			individuals = individualFactory.getIndividualsByRange(featureCount, 3, 4);
		})

		it('should return true and add individuals WHEN overrideSizeConstraints is true', () => {
			let overrideSizeConstraints = true;
			expect(group.getIndividualCount()).toEqual(0);
			let result = group.addIndividuals(individuals, overrideSizeConstraints);
			expect(result).toEqual(true);
			expect(group.getIndividualCount()).toEqual(individuals.length);
		})

	})

	describe('#addIndividual(individual, overrideSizeConstraints)', () => {

		let individuals;
		let individual;

		beforeEach(() => {
			individuals = individualFactory.getIndividualsByRange(featureCount, 3, 4);
			individual = individuals[0];
		})

		it('should return true and add individual WHEN overrideSizeConstraints is true', () => {
			let overrideSizeConstraints = true;
			expect(group.getIndividualCount()).toEqual(0);
			let result = group.addIndividual(individual, overrideSizeConstraints);
			expect(result).toEqual(true);
			expect(group.getIndividualCount()).toEqual(1);
		})

	})


})
