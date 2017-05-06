const _ = require('lodash');
const vec = require('javlin-pure');
const Individual = require('./individual');

class Group {

	constructor(featureCount, minSize, maxSize) {
		this.featureCount = featureCount;
		this.minSize = minSize;
		this.maxSize = maxSize;
		this.individuals = [];
	}

	getZeroIndividual() {
		let zeroIndividual = new Individual('zero');
		zeroIndividual.features = _.fill(Array(this.featureCount), 0);
		return zeroIndividual;
	}

	fromJsonObject(jsonObject) {
		this.featureCount = jsonObject.featureCount;
		this.minSize = jsonObject.minSize;
		this.maxSize = jsonObject.maxSize;
		this.individuals = _.map(jsonObject.individuals, (individualJson) => {
			let individual = new Individual();
			individual.fromJsonObject(individualJson);
			return individual;
		})
	}

	cloneEmpty() {
		let group = new Group(this.featureCount, this.minSize, this.maxSize);
		return group;
	}

	getIntersectionGroup(group) {
		let iGroup = group.cloneEmpty();
		iGroup.individuals = _.intersectionWith(group.individuals, this.individuals, (v1, v2) => {
			return v1 === v2;
		});
		return iGroup;
	}

	getDifferenceGroup(group) {
		let dGroup = group.cloneEmpty();
		dGroup.individuals = _.differenceWith(group.individuals, this.individuals, (v1, v2) => {
			return v1 === v2;
		});
		return dGroup;
	}

	removeRandomSubGroup(individualCount) {
		let subGroup = this.getRandomSubGroup(individualCount);
		let dGroup = this.getDifferenceGroup(subGroup);
		this.individuals = dGroup.individuals;
		return subGroup;
	}

	getRandomSubGroup(individualCount) {
		let subGroup = this.cloneEmpty();
		subGroup.individuals = _.sampleSize(this.individuals, individualCount);
		return subGroup;
	}

	addGroup(group) {
		if (group && group.individuals && group.individuals.length > 0) {
			this.individuals = _.concat(this.individuals, group.individuals);
		}
	}

	getCanAddIndividualCount() {
		if (this.canAddIndividual()) {
			return this.maxSize - this.individuals.length;
		}
		return 0;
	}

	getCanRemoveIndividualCount() {
		if (this.canRemoveIndividual()) {
			return this.individuals.length - this.minSize;
		}
		return 0;
	}

	canRemoveIndividual() {
		return this.individuals.length > this.minSize;
	}

	canAddIndividual() {
		return this.individuals.length < this.maxSize;
	}

	addRandomIndividuals(individualCount, featureCount, minValue, maxValue) {
		this.individuals = _.times(individualCount, (i) => {
			let individual = new Individual(i);
			individual.randomize(featureCount, minValue, maxValue);
			return individual;
		});
	}

	moveRandomIndividualToGroup(toGroup) {
		let individual = _.sample(this.individuals);
		if (individual) {
			_.remove(this.individuals, (v) => {
				return v === individual;
			});
			toGroup.individuals.push(individual);
		};
	}

	getSumIndividual() {
		let zeroIndividual = this.getZeroIndividual();

		if (this.individuals.length === 0) {
			return zeroIndividual;
		}

		return _.reduce(this.individuals, (sumIndividual, individual) => {
			sumIndividual.features = vec.add(sumIndividual.features, individual.features);
			return sumIndividual;
		}, zeroIndividual);
	}

	getAverageIndividual() {
		let zeroIndividual = this.getZeroIndividual();

		if (this.individuals.length === 0) {
			return zeroIndividual;
		}

		let sumIndividual = this.getSumIndividual();
		let averageIndividual = zeroIndividual;
		averageIndividual.features = vec.scale(sumIndividual.features, 1 / this.individuals.length);
		return averageIndividual;
	}

	addIndividual(individual) {
		this.individuals.push(individual);
	}

	containsIndividual(individual) {
		return this.individuals.indexOf(individual) !== -1;
	}

	removeRandomIndividual() {
		if (this.individuals.length > 0) {
			let individual = _.sample(this.individuals);
			_.remove(this.individuals, (ind) => {
				return ind === individual;
			});
			return individual;
		}
		return null;
	}


}

module.exports = Group;
