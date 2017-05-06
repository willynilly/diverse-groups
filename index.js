const _ = require('lodash');
const EvolutionManager = require('./evolution-manager');

let populationSize = 100;
let groupSizes = [2, 2, 5, 20, 1];
let featureCount = 2;
let minFeatureValue = 0;
let maxFeatureValue = 5;

let em = new EvolutionManager(populationSize, groupSizes, featureCount, minFeatureValue, maxFeatureValue);

em.evolve(200, true);
