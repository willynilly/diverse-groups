"use strict";

const _ = require('lodash');
const EvolutionManager = require('./evolution-manager');
const Group = require('./group');

let communityCount = 100;
let individualCount = 50;
let groupConfigs = [{
    name: 'dorm1',
    minSize: 10,
    maxSize: 15
}, {
    name: 'dorm2',
    minSize: 20,
    maxSize: 30,
}, {
    name: 'dorm3',
    minSize: 15,
    maxSize: 20,
}];

let featureCount = 2;
let minFeatureValue = 0;
let maxFeatureValue = 5;

let em = new EvolutionManager();
let individuals = em.createRandomIndividuals(individualCount, featureCount, minFeatureValue, maxFeatureValue);
let groups = _.map(groupConfigs, (groupConfig) => {
    let group = new Group(groupConfig.name, featureCount, groupConfig.minSize, groupConfig.maxSize);
    return group;
});
let leftOverGroup = em.randomlyAssignIndividualsToGroups(individuals, groups);
groups.push(leftOverGroup);

console.log('groups', groups);

let communities = em.createRandomCommunities(communityCount, groups);
let maxCommunityCount = communities.length;
em.setPopulation(communities, maxCommunityCount);
em.evolve(200, true);
