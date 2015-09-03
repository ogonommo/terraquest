var Planet = require('mongoose').model('Planet');

module.exports = {
	getPlanet: function(req, res, next) {
		Planet.findOne({}).exec(function(err, p) {
			if (err) {
				console.log('Could not reach planet ' + err);
				return;
			}
			//console.log('getting planet...');
			res.send(p);
		});
	},
	updatePlanet: function(effect) {
		Planet.findOne({}).exec(function(err, p){
			if (err) {
				console.log('Error getting planet ' + err);
				return;
			}
			if (effect) {
				for (var key in effect) {
					if (typeof effect[key] !== undefined) {
						//console.log('in planet, affecting key ' + key + ' with value ' + effect[key]/100);
						p[key] = p[key] + effect[key]/100;
					}
				}
				p.save(function(err){
					if (err) {
						console.log('Error saving planet data ' + err);
						return;
					}
				})
			}
		});
	}
}
