"use strict";

const EvolutionManager = require('./evolution-manager');
const IndividualFactory = require('./individual-factory');
const Individual = require('./individual');
const Group = require('./group');
const Community = require('./community');

module.exports = {
    Individual: Individual,
    EvolutionManager: EvolutionManager,
    Group: Group,
    Community: Community
};
