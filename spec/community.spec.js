"use strict";

let Community = require('../community');
let Individual = require('../individual');
let IndividualFactory = require('../individual-factory');
let Group = require('../group');
let _ = require('lodash');

describe('Community', () => {

    let community;

    let featureCount = 15;
    let minGroupSize = 1;
    let maxGroupSize = 12;
    let individualCountPerGroup = 6;
    let individualFactory = new IndividualFactory();

    beforeEach(() => {

        community = new Community();

    });


    describe('moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual)', () => {

        let fromGroup;
        let toGroup;
        let featureCount = 3;

        beforeEach(() => {
            community.removeAllGroups();
        });

        it('should return false if the community has less than 2 groups AND shouldSwapDisplacedIndividual is false', () => {
            let shouldSwapDisplacedIndividual = false;

            let fromMinSize = 1;
            let fromMaxSize = 10;
            let fromIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            fromGroup = new Group('from', featureCount, fromMinSize, fromMaxSize);
            fromGroup.addIndividuals(fromIndividuals);
            community.addGroup(fromGroup);

            let individual = _.sample(fromIndividuals);

            let result = community.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
            expect(result).toEqual(false);
        });

        it('should return false if the community has less than 2 groups AND shouldSwapDisplacedIndividual is true', () => {
            let shouldSwapDisplacedIndividual = true;

            let fromMinSize = 1;
            let fromMaxSize = 10;
            let fromIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            fromGroup = new Group('from', featureCount, fromMinSize, fromMaxSize);
            fromGroup.addIndividuals(fromIndividuals);
            community.addGroup(fromGroup);

            let individual = _.sample(fromIndividuals);

            let result = community.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
            expect(result).toEqual(false);
        });

        it('should remove the passed individual from its current group AND add it to another group WHEN shouldSwapDisplacedIndividual is false', () => {

            let shouldSwapDisplacedIndividual = false;

            let fromMinSize = 1;
            let fromMaxSize = 10;
            let fromIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            fromGroup = new Group('from', featureCount, fromMinSize, fromMaxSize);
            fromGroup.addIndividuals(fromIndividuals);
            community.addGroup(fromGroup);

            let individual = _.sample(fromIndividuals);

            let toMinSize = 1;
            let toMaxSize = 5;
            let toIndividuals = individualFactory.getIndividualsByRange(featureCount, 3, 4);
            toGroup = new Group('to', featureCount, toMinSize, toMaxSize);
            toGroup.addIndividuals(toIndividuals);
            community.addGroup(toGroup);

            let beforeAllIndividuals = _.concat(fromGroup.getIndividuals(), toGroup.getIndividuals());

            expect(fromGroup.getIndividuals().length).toBe(2);
            expect(toGroup.getIndividuals().length).toBe(2);
            community.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
            expect(fromGroup.getIndividuals().length).toBe(1);
            expect(toGroup.getIndividuals().length).toBe(3);

            let afterAllIndividuals = community.getAllIndividuals();
            let newElements = _.differenceWith(beforeAllIndividuals, afterAllIndividuals, (a, b) => {
                return a === b;
            });
            expect(newElements).toEqual([]);

        });

        it('should remove the passed individual from its current group AND add it to another group WHEN shouldSwapDisplacedIndividual is true', () => {

            let shouldSwapDisplacedIndividual = true;

            let fromMinSize = 1;
            let fromMaxSize = 10;
            let fromIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            fromGroup = new Group('from', featureCount, fromMinSize, fromMaxSize);
            fromGroup.addIndividuals(fromIndividuals);
            community.addGroup(fromGroup);

            let toMinSize = 1;
            let toMaxSize = 5;
            let toIndividuals = individualFactory.getIndividualsByRange(featureCount, 3, 4);
            toGroup = new Group('to', featureCount, toMinSize, toMaxSize);
            toGroup.addIndividuals(toIndividuals);
            community.addGroup(toGroup);

            let individual = _.sample(fromIndividuals);

            let beforeAllIndividuals = _.concat(fromGroup.getIndividuals(), toGroup.getIndividuals());

            expect(fromGroup.getIndividuals().length).toBe(2);
            expect(toGroup.getIndividuals().length).toBe(2);
            community.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
            expect(fromGroup.getIndividuals().length).toBe(1);
            expect(toGroup.getIndividuals().length).toBe(3);

            let afterAllIndividuals = _.concat(fromGroup.getIndividuals(), toGroup.getIndividuals());
            let newElements = _.differenceWith(beforeAllIndividuals, afterAllIndividuals, (a, b) => {
                return a === b;
            });
            expect(newElements).toEqual([]);

        });

        it('should not remove the individual WHEN there are less than two groups AND shouldSwapDisplacedIndividual equals false', () => {
            let shouldSwapDisplacedIndividual = false;

            let fromMinSize = 1;
            let fromMaxSize = 10;
            let fromIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            fromGroup = new Group('from', featureCount, fromMinSize, fromMaxSize);
            fromGroup.addIndividuals(fromIndividuals);
            community.addGroup(fromGroup);

            let individual = _.sample(fromIndividuals);

            let beforeAllIndividuals = fromGroup.getIndividuals();

            expect(fromGroup.getIndividuals().length).toBe(2);
            community.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
            expect(fromGroup.getIndividuals().length).toBe(2);

            let afterAllIndividuals = community.getAllIndividuals();
            let newElements = _.differenceWith(beforeAllIndividuals, afterAllIndividuals, (a, b) => {
                return a === b;
            });
            expect(newElements).toEqual([]);

        });

        it('should not remove the individual WHEN there are less than two groups AND shouldSwapDisplacedIndividual equals true', () => {
            let shouldSwapDisplacedIndividual = true;

            let fromMinSize = 1;
            let fromMaxSize = 10;
            let fromIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            fromGroup = new Group('from', featureCount, fromMinSize, fromMaxSize);
            fromGroup.addIndividuals(fromIndividuals);
            community.addGroup(fromGroup);

            let individual = _.sample(fromIndividuals);

            let beforeAllIndividuals = fromGroup.getIndividuals();

            expect(fromGroup.getIndividuals().length).toBe(2);
            community.moveIndividualToAnotherRandomGroup(individual, shouldSwapDisplacedIndividual);
            expect(fromGroup.getIndividuals().length).toBe(2);

            let afterAllIndividuals = community.getAllIndividuals();
            let newElements = _.differenceWith(beforeAllIndividuals, afterAllIndividuals, (a, b) => {
                return a === b;
            });
            expect(newElements).toEqual([]);

        });

    });

    describe('#getGroupWithIndividual(individual)', () => {


        let groupA;
        let groupAIndividuals;
        let groupB;
        let groupBIndividuals;

        beforeEach(() => {
            let minSize = 1;
            let maxSize = 10;

            groupAIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            groupA = new Group('a', featureCount, minSize, maxSize);
            groupA.addIndividuals(groupAIndividuals);
            community.addGroup(groupA);

            groupBIndividuals = individualFactory.getIndividualsByRange(featureCount, 3, 4);
            groupB = new Group('b', featureCount, minSize, maxSize);
            groupB.addIndividuals(groupBIndividuals);
            community.addGroup(groupB);
        });

        it('should return false if the individual does not exist in the group', () => {
            let individual = individualFactory.getIndividualsByRange(featureCount, 6, 6)[0];
            let result = community.getGroupWithIndividual(individual);
            expect(result).toEqual(false);
        });

        it('should return the first group with the individual if the individual does exist in a group', () => {
            let individual = groupBIndividuals[0];
            let result = community.getGroupWithIndividual(individual);
            expect(result).toEqual(groupB);
        });
    });

    describe('#getAllIndividuals', () => {

        let groupA;
        let groupAIndividuals;
        let groupB;
        let groupBIndividuals;

        beforeEach(() => {
            let minSize = 1;
            let maxSize = 10;

            groupAIndividuals = individualFactory.getIndividualsByRange(featureCount, 1, 2);
            groupA = new Group('a', featureCount, minSize, maxSize);
            groupA.addIndividuals(groupAIndividuals);
            community.addGroup(groupA);

            groupBIndividuals = individualFactory.getIndividualsByRange(featureCount, 3, 12);
            groupB = new Group('b', featureCount, minSize, maxSize);
            groupB.addIndividuals(groupBIndividuals);
            community.addGroup(groupB);
        });

        it('should return all the individuals from all of the groups', () => {
            let expectedIndividuals = _.concat(groupAIndividuals, groupBIndividuals);
            let individuals = community.getAllIndividuals();
            expect(individuals).toEqual(expectedIndividuals);
        });
    });

    // describe('#getAllIndividualsFromGroups(groups)', () => {
    // 	it('should return an array with all inds from groups', () => {
    // 		let expectedAllIndividuals = [
    // 			[1, 1, 1],
    // 			[2, 2, 2],
    // 			[3, 3, 3],
    // 			[4, 4, 4]
    // 		];
    // 		let allIndividuals = gm.getAllIndividualsFromGroups(groups);
    // 		expect(allIndividuals).toEqual(expectedAllIndividuals);
    // 	})
    //
    // 	it('should return zero ind if there are no inds in a group', () => {
    // 		let group = [];
    // 		let sumIndividual = gm.getSumIndividualFromGroup(group);
    // 		expect(sumIndividual).toEqual([0, 0, 0])
    // 	})
    // })
    //
    // describe('#crossoverGroup(groupA, groupB, usedIndividuals)', () => {
    // 	it('should return a group that does not have any usedIndividuals', () => {
    // 		let usedIndividuals = [
    // 			[1, 1, 1],
    // 			[2, 2, 2]
    // 		];
    // 		let groupA = [
    // 			[0, 0, 0],
    // 			[1, 1, 1]
    // 		];
    // 		let groupB = [
    // 			[3, 3, 3],
    // 			[2, 2, 2]
    // 		];
    // 		let group = gm.crossoverGroup(groupA, groupB, usedIndividuals);
    //
    // 		expect(_.intersection(group, usedIndividuals)).toEqual([]);
    // 	})
    //
    // })
    //
    // describe('#getSumIndividualFromGroup(group)', () => {
    // 	it('should sum all the inds in a group', () => {
    // 		let group = groups[0];
    // 		let sumIndividual = gm.getSumIndividualFromGroup(group);
    // 		expect(sumIndividual).toEqual([6, 6, 6])
    // 	})
    //
    // 	it('should return zero ind if there are no inds in a group', () => {
    // 		let group = [];
    // 		let sumIndividual = gm.getSumIndividualFromGroup(group);
    // 		expect(sumIndividual).toEqual([0, 0, 0])
    // 	})
    // })
    //
    //
    // describe('#getAverageIndividualFromGroup(group)', () => {
    // 	it('should sum all the inds in a group and divide by the number of inds in group', () => {
    // 		let group = groups[0];
    // 		let averageIndividual = gm.getAverageIndividualFromGroup(group);
    // 		expect(averageIndividual).toEqual([2, 2, 2])
    // 	})
    //
    // 	it('should return zero ind if there are no inds in a group', () => {
    // 		let group = [];
    // 		let averageIndividual = gm.getAverageIndividualFromGroup(group);
    // 		expect(averageIndividual).toEqual([0, 0, 0])
    // 	})
    // })
    //
    //
    // describe('#getScoreForGroup(group)', () => {
    // 	it('should return a score equal to the sum of the Euclidean distances between each ind and the average ind of the group', () => {
    // 		let group = [
    // 			[1, 0, 0],
    // 			[2, 0, 0],
    // 			[3, 0, 0]
    // 		];
    // 		let score = gm.getScoreForGroup(group);
    // 		let expectedScore = 2;
    // 		expect(score).toEqual(expectedScore);
    // 	})
    //
    // 	it('should return zero if there are no inds in a group', () => {
    // 		let group = [];
    // 		let score = gm.getScoreForGroup(group);
    // 		let expectedScore = 0;
    // 		expect(score).toEqual(expectedScore);
    // 	})
    //
    // 	it('should return zero if there is a single ind in a group', () => {
    // 		let group = [
    // 			[1, 1, 1]
    // 		];
    // 		let score = gm.getScoreForGroup(group);
    // 		let expectedScore = 0;
    // 		expect(score).toEqual(expectedScore);
    // 	})
    // })

    // describe('#getIndividualDistance(indA, indB)', () => {
    // 	it('should return the Euclidean distance between two inds', () => {
    // 		let indA = [3, 0, 0];
    // 		let indB = [0, 4, 0];
    // 		let distance = gm.getIndividualDistance(indA, indB);
    // 		let expectedDistance = 5;
    // 		expect(distance).toEqual(expectedDistance);
    // 	})
    // })

});
