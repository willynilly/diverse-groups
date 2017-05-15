"use strict";

let _ = require('lodash');
let Individual = require('./individual');

class IndividualFactory {

    constructor() {}

    getIndividualsByRange(featureCount, startIndex, endIndex) {
        let individualCount = endIndex - startIndex + 1;
        return _.times(individualCount, (i) => {
            let num = startIndex + i;
            let features = _.times(featureCount, (j) => {
                return num;
            });
            let individual = new Individual(num + '', features);
            return individual;
        });
    }
}

module.exports = IndividualFactory;
