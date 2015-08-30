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
	updatePlanet: function(req, res, next) {
		
	}
}