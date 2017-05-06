const _ = require('lodash');
const Group = require('./group');

class Community {
	constructor() {
		this.groups = [];
	}

	fromJsonObject(jsonObj) {
		this.groups = jsonObj.groups.map((groupJson) => {
			let group = new Group();
			group.fromJsonObject(groupJson);
			return group;
		});
	}

	getAllFeatures() {
		let features = _.map(this.groups, (group) => {
			return _.map(group.individuals, (individual) => {
				return individual.features;
			});
		});
		return features;
	}

	getAllIndividuals() {
		return _.reduce(this.groups, (allIndividuals, group) => {
			return _.concat(allIndividuals, group.individuals);
		}, []);
	}

	addRandomGroups(groupSizes, featureCount, minFeatureValue, maxFeatureValue) {
		let groupsToAdd = _.map(groupSizes, (groupSize) => {
			let group = new Group(featureCount, groupSize, groupSize);
			group.addRandomIndividuals(groupSize, featureCount, minFeatureValue, maxFeatureValue);
			return group;
		});
		this.groups = _.concat(this.groups, groupsToAdd);
	}

	moveRandomIndividualBetweenTwoRandomGroups() {
		if (this.groups.length > 1) {
			let targetGroups = _.sampleSize(this.groups, 2);
			let fromGroup = targetGroups[0];
			let toGroup = targetGroups[1];
			let otherIndividual = null;
			if (!fromGroup.canAddIndividual()) {
				otherIndividual = toGroup.removeRandomIndividual();
			}
			fromGroup.moveRandomIndividualToGroup(toGroup);
			if (otherIndividual !== null) {
				fromGroup.addIndividual(otherIndividual);
			}
		}
	}


}

module.exports = Community;
