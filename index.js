const _ = require('lodash');
const EvolutionManager = require('./evolution-manager');

let communityCount = 100;
let groupSizes = [2, 2, 5, 20, 1];
let featureCount = 2;
let minFeatureValue = 0;
let maxFeatureValue = 5;

let em = new EvolutionManager();
let communities = em.createRandomCommunities(communityCount, groupSizes, featureCount, minFeatureValue, maxFeatureValue);
let maxCommunityCount = communities.length;
em.setPopulation(communities, maxCommunityCount);
em.evolve(200, true);
