"use strict";

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

    addGroup(group) {
        this.groups.push(group);
    }

    addGroups(groups) {
        this.groups = _.concat(this.groups, groups);
    }

    removeAllGroups() {
        this.groups = [];
    }

    removeAllIndividuals() {
        let allIndividuals = this.getAllIndividuals();
        _.forEach(this.groups, (group) => {
            group.individuals = [];
        });
        return allIndividuals;
    }

    shuffleIndividualsAcrossGroups() {
        let individuals = this.removeAllIndividuals();
        let groups = this.addIndividualsToRandomGroups(individuals);
        return groups;
    }

    addIndividualsToRandomGroups(individuals) {
        let groups = [];
        _.forEach(individuals, (individual) => {
            groups.push(this.addIndividualToRandomGroup(individual));
        });
        return groups;
    }

    addIndividualToRandomGroup(individual) {
        let groupsThatCanAddAnIndividual = _.filter(this.groups, (group) => {
            return group.canAddIndividual();
        });
        if (groupsThatCanAddAnIndividual.length) {
            let group = _.sample(groupsThatCanAddAnIndividual);
            group.addIndividual(individual);
            return group;
        }
        return null;
    }

    getGroupWithIndividual(individual) {
        let index = _.findIndex(this.groups, (group) => {
            return group.containsIndividual(individual);
        });
        if (index !== -1) {
            return this.groups[index];
        }
        return false;
    }

    removeIndividual(individual) {
        let fromGroup = this.getGroupWithIndividual(individual);
        if (fromGroup !== null) {
            return fromGroup.removeIndividual(individual);
        }
        return false;
    }

    moveRandomIndividualToAnotherRandomGroup(shouldSwapDisplacedIndividual) {
        if (this.groups.length >= 2) {
            let individual = _.sample(this.getAllIndividuals());
            this.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
        }
        return false;
    }

    moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual) {
        if (individual !== null && this.groups.length >= 2) {
            let fromGroup = this.getGroupWithIndividual(individual);
            let overrideSizeConstraints = true;
            fromGroup.removeIndividual(individual, overrideSizeConstraints);
            let toGroup = _.sample(_.filter(this.groups, (group) => {
                return group !== fromGroup;
            }));
            let displacedIndividual = toGroup.addIndividualOrSwapWithRandomIndividual(individual);
            if (displacedIndividual !== true && displacedIndividual !== false) {
                if (!shouldSwapDisplacedIndividual) {
                    return displacedIndividual;
                }
                fromGroup.addIndividual(displacedIndividual, overrideSizeConstraints);
            }
            return true;
        }
        return false;
    }
}

module.exports = Community;
