const euclidean = require('ml-distance').distance.euclidean;
const _ = require('lodash');

class Individual {

	constructor(id, features) {
		this.id = id;
		this.features = features || [];
	}

	fromJsonObject(jsonObject) {
		this.id = jsonObject.id;
		this.features = jsonObject.features;
	}

	distance(otherIndividual) {
		return euclidean(this.features, otherIndividual.features);
	}

	randomize(featureCount, minValue, maxValue) {
		this.features = _.times(featureCount, () => {
			return _.random(minValue, maxValue)
		});
	}

}

module.exports = Individual;
