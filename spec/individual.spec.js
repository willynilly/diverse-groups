let _ = require('lodash');
let Group = require('../group');
let Individual = require('../individual');

describe('Individual', () => {

	let individual;
	let id = 'someid';
	let features = [3, 4, 5];

	beforeEach(() => {
		individual = new Individual(id, features);
	})

	describe('#constructor()', () => {
		it('should set the id', () => {
			expect(individual.id).toEqual(id);
		})

		it('should set the features', () => {
			expect(individual.features).toEqual(features);
		})
	})

	describe('#fromJsonObject(jsonObject)', () => {
		it('should set the id', () => {
			let jsonObject = {
				"id": "bob",
				"features": [5, 3]
			};
			individual.fromJsonObject(jsonObject);
			expect(individual.id).toEqual("bob");
		})

		it('should set the features', () => {
			let jsonObject = {
				"id": "bob",
				"features": [5, 3]
			};
			individual.fromJsonObject(jsonObject);
			expect(individual.features).toEqual([5, 3]);
		})
	})

	describe('#distance(otherIndividual)', () => {
		it('should return euclidean distance of features from the features of otherIndividual', () => {
			let otherIndividual = new Individual('other', [3, 4, 10])
			let distance = individual.distance(otherIndividual);
			let expectedDistance = 5;
			expect(distance).toEqual(expectedDistance);
		})
	})

	describe('#randomize(featureCount, minValue, maxValue)', () => {
		it('should change features to an array of featureCount', () => {
			let featureCount = 11;
			let minValue = 4;
			let maxValue = 5;
			individual.randomize(featureCount, minValue, maxValue);
			expect(individual.features.length).toEqual(featureCount);
		})

		it('should change features so that they are all between minValue and maxValue inclusive', () => {
			let featureCount = 11;
			let minValue = 4;
			let maxValue = 5;
			individual.randomize(featureCount, minValue, maxValue);
			let outliers = _.filter(individual.features, (v) => {
				return v < minValue || v > maxValue;
			});
			expect(outliers.length).toEqual(0);
		})
	})

})
