"use strict";

let EvolutionManager = require('../evolution-manager');
let Community = require('../community');
let Group = require('../group');
let Individual = require('../individual');

let _ = require('lodash');

describe('EvolutionManager', () => {

  let em;
  let individuals;
  let groups;
  let communities;

  let individualCount = 100;
  let groupCount = 3;
  let minGroupSize = 2;
  let maxGroupSize = 10;
  let communityCount = 100;
  let maxCommunityCount = 100;
  let featureCount = 2;
  let minFeatureValue = 0;
  let maxFeatureValue = 3;

  beforeEach(() => {
    em = new EvolutionManager();
    individuals = em.createRandomIndividuals(individualCount, featureCount, minFeatureValue, maxFeatureValue);
    groups = em.createRandomGroups(groupCount, featureCount, minGroupSize, maxGroupSize, individuals);
    communities = em.createRandomCommunities(communityCount, groups);
    em.setPopulation(communities, maxCommunityCount);
  });

  describe('#createRandomIndividuals(individualCount, featureCount, minFeatureValue, maxFeatureValue)', () => {
    let individuals;

    beforeEach(() => {
      individuals = em.createRandomIndividuals(individualCount, featureCount, minFeatureValue, maxFeatureValue);
    });

    it('should return an array of individuals of size individualCount', () => {
      expect(individuals.length).toEqual(individualCount);
    });

    it('should return an array of individuals, where each individual has an array of features of size featureCount', () => {
      let hasWrongFeatureCount = _.some(individuals, (individual) => {
        return !_.isArray(individual.features) || individual.features.length !== featureCount;
      });
      expect(hasWrongFeatureCount).toEqual(false);
    });

    it('should return an array of individuals, where each individual has an id equal to its index in the array', () => {
      let hasWrongId = _.some(individuals, (individual, i) => {
        return individual.id === (i + '');
      });
      expect(hasWrongId).toEqual(false);
    });

  });

  describe('#createRandomEmptyGroups(groupCount, featureCount, minGroupSize, maxGroupSize)', () => {
    let emptyGroups;

    beforeEach(() => {
      emptyGroups = em.createRandomEmptyGroups(groupCount, featureCount, minGroupSize, maxGroupSize);
    });

    it('should return an array of groups with groupCount groups', () => {
      expect(emptyGroups.length).toEqual(groupCount);
    });

    it('should return an array of groups where each group has the specified featureCount', () => {
      let hasWrongFeatureCount = _.some(emptyGroups, (group) => {
        return group.featureCount !== featureCount;
      });
      expect(hasWrongFeatureCount).toEqual(false);
    });

    it('should return an array of groups where each group has a minGroupSize between minGroupSize and maxGroupSize inclusive', () => {
      let hasWrongMinGroupSize = _.some(emptyGroups, (group) => {
        return group.minSize < minGroupSize || group.minSize > maxGroupSize;
      });
      expect(hasWrongMinGroupSize).toEqual(false);
    });

    it('should return an array of groups where each group has a minGroupSize between minGroupSize and maxGroupSize inclusive', () => {
      let hasWrongMaxGroupSize = _.some(emptyGroups, (group) => {
        return group.maxSize < minGroupSize || group.maxSize > maxGroupSize;
      });
      expect(hasWrongMaxGroupSize).toEqual(false);
    });

    it('should return an array of groups where each group has an empty array of individuals', () => {
      let hasWrongIndividualCount = _.some(emptyGroups, (group) => {
        return !_.isArray(group.individuals) || group.individuals.length !== 0;
      });
      expect(hasWrongIndividualCount).toEqual(false);
    });

  });

  describe('#randomlyAssignIndividualsToGroups(individuals, groups)', () => {

    let groups;
    let leftOverGroup;

    beforeEach(() => {
      groups = em.createRandomEmptyGroups(groupCount, featureCount, minGroupSize, maxGroupSize);
      leftOverGroup = em.randomlyAssignIndividualsToGroups(individuals, groups);
    });

    it('should return a group containing leftover individuals that has a minSize of 0', () => {
      expect(leftOverGroup.minSize).toEqual(0);
    });

    it('should return a group containing leftover individuals that has a maxSize equal to the sum of the individuals in the groups plus the length of the input individuals', () => {
      groups = em.createRandomEmptyGroups(groupCount, featureCount, minGroupSize, maxGroupSize);
      let individual = em.createRandomIndividuals(1, featureCount, minFeatureValue, maxFeatureValue);
      groups[0].addIndividual(individual);
      leftOverGroup = em.randomlyAssignIndividualsToGroups(individuals, groups);

      let expectedMaxSize = individuals.length + 1;
      expect(leftOverGroup.maxSize).toEqual(expectedMaxSize);
    });
  });

  describe('#mutate(communityJsonObject)', () => {
    it('should return a community with the same number of individuals', () => {
      let communityA = communities[0];
      let resultCommunity = em.mutate(communityA);
      let individualCount = resultCommunity.getAllIndividuals().length;
      let expectedIndividualCount = individualCount;
      expect(individualCount).toEqual(expectedIndividualCount);
    });

    it('should return a community with the same number of groups', () => {
      let expectedGroupCount = groupCount + 1;
      let communityA = communities[0];
      expect(communityA.groups.length).toEqual(expectedGroupCount);
      let resultCommunity = em.mutate(communityA);
      let resultGroupCount = resultCommunity.groups.length;
      expect(resultGroupCount).toEqual(expectedGroupCount);
    });


    // it('should return a community where a random individual from a random group A is moved to another random group B, and if B is full, it should have a random individual from B moved to A', () => {
    // 	let communityA = communities[0];
    // 	let result = em.mutate(communityA);
    //
    // })
  });

  describe('#crossover(communityA, communityB)', () => {

    let communityA, communityB;

    beforeEach(() => {
      communityA = communities[0];
      communityB = communities[1];
    });

    it('should return two communities with the same number of individuals', () => {
      let resultCommunities = em.crossover(communityA, communityB);
      let expectedIndividualCount = individualCount;
      let individualCountA = resultCommunities[0].getAllIndividuals().length;
      let individualCountB = resultCommunities[1].getAllIndividuals().length;
      expect(individualCountA).toEqual(expectedIndividualCount);
      expect(individualCountB).toEqual(expectedIndividualCount);
    });

    it('should return two communities with the same number of groups as in communityA and communityB', () => {
      let expectedGroupCount = groupCount + 1;
      expect(communityA.groups.length).toEqual(expectedGroupCount);
      expect(communityB.groups.length).toEqual(expectedGroupCount);
      let resultCommunities = em.crossover(communityA, communityB);
      let groupCountA = resultCommunities[0].groups.length;
      let groupCountB = resultCommunities[1].groups.length;
      expect(groupCountA).toEqual(expectedGroupCount);
      expect(groupCountB).toEqual(expectedGroupCount);
    });

    it('should return an array with two communities', () => {
      let resultCommunities = em.crossover(communityA, communityB);
      expect(resultCommunities.length).toEqual(2);
    });
  });

  describe('#crossoverGroup(groupA, groupB, leftOverGroup)', () => {
    it('should return a group that has the intersection of groupA and groupB', () => {
      let leftOverGroup = new Group('left', 3, 1, 1);
      let individual5 = new Individual('5', [5, 5, 5]);
      leftOverGroup.addIndividual(individual5);

      let individual0 = new Individual('0', [0, 0, 0]);
      let individual2 = new Individual('2', [2, 2, 2]);
      let individual3 = new Individual('3', [3, 3, 3]);

      let sharedIndividual1 = new Individual('1', [1, 1, 1]);
      let sharedIndividual6 = new Individual('6', [6, 6, 6]);

      let groupA = new Group('a', 3, 3, 3);
      groupA.addIndividual(individual0);
      groupA.addIndividual(sharedIndividual1);
      groupA.addIndividual(sharedIndividual6);

      let groupB = new Group('b', 3, 4, 4);
      groupB.addIndividual(individual3);
      groupB.addIndividual(individual2);
      groupB.addIndividual(sharedIndividual1);
      groupB.addIndividual(sharedIndividual6);

      let groupC = em.crossoverGroup(groupA, groupB, leftOverGroup);
      expect(groupC.containsIndividual(sharedIndividual1)).toEqual(true);
      expect(groupC.containsIndividual(sharedIndividual6)).toEqual(true);

    });

  });

  describe('#getScoreForGroup(group)', () => {
    it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
      let individual1 = new Individual('1', [3, 3, 3]);
      let individual2 = new Individual('2', [4, 4, 4]);
      let individual3 = new Individual('3', [5, 5, 5]);

      let group = new Group('someGroup', 3, 3, 3);
      group.addIndividual(individual1);
      group.addIndividual(individual2);
      group.addIndividual(individual3);

      let score = em.getScoreForGroup(group);
      let expectedScore = 3.4641016151377544;
      expect(score).toEqual(expectedScore);
    });

    it('should return zero if there are no inds in a group', () => {
      let group = new Group('someGroup', 3, 0, 0);
      expect(group.getIndividualCount()).toEqual(0);
      let score = em.getScoreForGroup(group);
      let expectedScore = 0;
      expect(score).toEqual(expectedScore);
    });

    it('should return zero if there is a single ind in a group', () => {
      let individual1 = new Individual('1', [1, 1, 1]);
      let group = new Group('someGroup', 3, 3, 3);
      group.addIndividual(individual1);

      let score = em.getScoreForGroup(group);
      let expectedScore = 0;
      expect(score).toEqual(expectedScore);
    });

    it('should return zero if the id of the group is in groupIdsToNotScore', () => {
      let individual1 = new Individual('1', [3, 3, 3]);
      let individual2 = new Individual('2', [4, 4, 4]);
      let individual3 = new Individual('3', [5, 5, 5]);

      let group = new Group('someGroup', 3, 3, 3);
      group.addIndividual(individual1);
      group.addIndividual(individual2);
      group.addIndividual(individual3);

      em.groupIdsToNotScore = ['someGroup'];
      let score = em.getScoreForGroup(group);
      let expectedScore = 0;
      expect(score).toEqual(expectedScore);
    });

    it('should return zero if the id of the group is "leftover" because "leftover" should be the groupIdsToNotScore', () => {
      let individual1 = new Individual('1', [3, 3, 3]);
      let individual2 = new Individual('2', [4, 4, 4]);
      let individual3 = new Individual('3', [5, 5, 5]);

      let group = new Group('leftover', 3, 3, 3);
      group.addIndividual(individual1);
      group.addIndividual(individual2);
      group.addIndividual(individual3);

      expect(em.groupIdsToNotScore).toEqual(['leftover']);
      let score = em.getScoreForGroup(group);
      let expectedScore = 0;
      expect(score).toEqual(expectedScore);
    });
  });


  describe('#getScoreForCommunity(community)', () => {
    it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
      let individual1 = new Individual('1', [3, 3, 3]);
      let individual2 = new Individual('2', [4, 4, 4]);
      let individual3 = new Individual('3', [5, 5, 5]);

      let groupA = new Group('a', 3, 3, 3);
      groupA.addIndividual(individual1);
      groupA.addIndividual(individual2);
      groupA.addIndividual(individual3);

      let individual4 = new Individual('4', [3, 3, 3]);
      let individual5 = new Individual('5', [4, 4, 4]);
      let individual6 = new Individual('6', [5, 5, 5]);

      let leftOverGroup = new Group('leftover', 3, 3, 3);
      leftOverGroup.addIndividual(individual4);
      leftOverGroup.addIndividual(individual5);
      leftOverGroup.addIndividual(individual6);

      let individual7 = new Individual('7', [1, 0, 0]);
      let individual8 = new Individual('8', [2, 0, 0]);
      let individual9 = new Individual('9', [3, 0, 0]);

      let groupB = new Group('b', 3, 3, 3);
      groupB.addIndividual(individual7);
      groupB.addIndividual(individual8);
      groupB.addIndividual(individual9);

      let emptyGroup = new Group('empty', 3, 0, 0);

      let community = new Community();
      community.addGroup(groupA);
      community.addGroup(leftOverGroup);
      community.addGroup(groupB);
      community.addGroup(emptyGroup);

      expect(community.groups.length).toEqual(4);

      let score = em.getScoreForCommunity(community);
      let expectedScore = 5.4641016151377544;
      expect(score).toEqual(expectedScore);
    });

    it('should return zero if there are no groups in the community', () => {
      let community = new Community();
      expect(community.groups.length).toEqual(0);
      let score = em.getScoreForCommunity(community);
      let expectedScore = 0;
      expect(score).toEqual(expectedScore);
    });
  });

});
