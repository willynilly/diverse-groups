"use strict";

const _ = require('lodash');
const vec = require('javlin-pure');
const Individual = require('./individual');

class Group {

    constructor(id, featureCount, minSize, maxSize) {
        this.id = id;
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
        this.id = jsonObject.id;
        this.featureCount = jsonObject.featureCount;
        this.minSize = jsonObject.minSize;
        this.maxSize = jsonObject.maxSize;
        this.individuals = _.map(jsonObject.individuals, (individualJson) => {
            let individual = new Individual();
            individual.fromJsonObject(individualJson);
            return individual;
        });
    }

    cloneEmpty() {
        let group = new Group(this.id, this.featureCount, this.minSize, this.maxSize);
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

    removeRandomSubGroup(individualCount, overrideSizeConstraints) {
        if (overrideSizeConstraints || individualCount <= this.getCanRemoveIndividualCount()) {
            let subGroup = this.getRandomSubGroup(individualCount);
            let dGroup = this.getDifferenceGroup(subGroup);
            this.individuals = dGroup.individuals;
            return subGroup;
        }
        return false;
    }

    getRandomSubGroup(individualCount) {
        let subGroup = this.cloneEmpty();
        subGroup.individuals = _.sampleSize(this.individuals, individualCount);
        return subGroup;
    }

    addGroup(group, overrideSizeConstraints) {
        if (group && group.getIndividualCount() > 0 && (overrideSizeConstraints || group.individuals.length <= this.canAddIndividualCount())) {
            this.addIndividuals(group.getIndividuals());
            return true;
        }
        return false;
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

    moveRandomIndividualToGroup(toGroup, overrideSizeConstraints) {
        let individual = this.getRandomIndividual();
        if (individual !== null) {
            if (overrideSizeConstraints || (this.canRemoveIndividual() && toGroup.canAddIndividual())) {
                this.removeIndividual(individual, overrideSizeConstraints);
                toGroup.addIndividual(individual, overrideSizeConstraints);
                return individual;
            }
        }
        return false;
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

    addIndividual(individual, overrideSizeConstraints) {
        if (overrideSizeConstraints || this.canAddIndividual()) {
            this.individuals.push(individual);
            return true;
        }
        return false;
    }

    addIndividuals(individuals, overrideSizeConstraints) {
        if (overrideSizeConstraints || individuals.length <= this.getCanAddIndividualCount()) {
            _.forEach(individuals, (individual) => {
                this.addIndividual(individual, overrideSizeConstraints);
            });
            return true;
        }
        return false;
    }

    addIndividualOrSwapWithRandomIndividual(individual) {
        if (this.canAddIndividual()) {
            return this.addIndividual(individual);
        } else {
            return this.swapWithRandomIndividual(individual);
        }
    }

    swapWithRandomIndividual(individual) {
        if (individual !== null && this.individuals.length >= 1) {
            let overrideSizeConstraints = true;
            let removedIndividual = this.removeRandomIndividual(overrideSizeConstraints);
            this.addIndividual(individual, overrideSizeConstraints);
            return removedIndividual;
        }
        return false;
    }

    containsIndividual(individual) {
        return this.individuals.indexOf(individual) !== -1;
    }

    getRandomIndividual() {
        return _.sample(this.individuals);
    }

    removeAllIndividuals() {
        this.individuals = [];
        return true;
    }

    removeIndividuals(individuals, overrideSizeConstraints) {
        let individualsToRemove = _.filter(individuals, (individual) => {
            return this.containsIndividual(individual);
        });
        if (overrideSizeConstraints || individualsToRemove.length <= this.getCanRemoveIndividualCount()) {
            _.forEach(individuals, (individual) => {
                this.removeIndividual(individual, overrideSizeConstraints);
            });
            return true;
        }
        return false;
    }

    removeIndividual(individual, overrideSizeConstraints) {
        if (this.containsIndividual(individual)) {
            if (overrideSizeConstraints || this.canRemoveIndividual()) {
                _.remove(this.individuals, (ind) => {
                    return ind === individual;
                });
                return true;
            }
        }
        return false;
    }

    removeRandomIndividual(overrideSizeConstraints) {
        let individual = this.getRandomIndividual();
        if (this.removeIndividual(individual, overrideSizeConstraints) === true) {
            return individual;
        }
        return false;
    }

    getIndividuals() {
        return this.individuals;
    }

    getIndividualCount() {
        return this.individuals.length;
    }

}

module.exports = Group;
