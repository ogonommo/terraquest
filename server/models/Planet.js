var mongoose = require('mongoose');

var PlanetSchema = mongoose.Schema({
	name: String,
	createdAt: Date,
	population: Number,
	kardashev: Number,
	temperature: Number,
	water: Number,
	vegetation: Number,
	zoosphere: Number,
	noosphere: Number,
	pollution: Number,
	evolutionIndex: Number,
	entities: [String]
}, {collection: 'planet'});

var Planet = mongoose.model('Planet', PlanetSchema);

module.exports.initializePlanet = function() {
	Planet.find({}).exec(function(err, collection){
		if (err) {
			console.log('Cannot handle planet: ' + err);
			return;
		}
		if (collection.length === 0) {
			//Initialize Planet Data
			Planet.create({
				name: 'Alcoria',
				createdAt: Date.now(),
				population: 100,
				kardashev: 0.1,
				temperature: 50,
				water: 50,
				vegetation: 50,
				zoosphere: 50,
				noosphere: 1,
				pollution: 0,
				evolutionIndex: 1,
				entities: ['undiscovered']
			});
		}
	});
};