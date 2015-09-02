var mongoose = require('mongoose');
var gamePlayerClass = require('../../public/app/game/gamePlayer');

var PlayerSchema = mongoose.Schema({
	userId: String,
	level: Number,
	experience: Number,
	lastCheckpoint: Date,
	lastAction: Date,
	actions: Number,
	gold: Number,
	bionium: Number,
	qubitium: Number,
	transendium: Number,
	fraction: String,
	gaiaIndex: Number,
	props: [String]
}, {collection: 'players'});

var Player = mongoose.model('Player', PlayerSchema);

module.exports.initPlayer = function(id) {
	Player.findOne({userId: id}).exec(function(err, p){
		if (err) {
			console.log('Error fetching player data: ' + err);
			return;
		}
		if (!p) {
			//Create player with given user ID
			Player.create({
				userId: id,
				level: 1,
				experience: 0,
				lastCheckpoint: Date.now(),
				lastAction: Date.now(),
				actions: 5,
				gold: 1000,
				bionium: 100,
				qubitium: 0,
				transendium: 0,
				fraction: '',
				gaiaIndex: 0.1,
				props: []
			});
			console.log('player created');
		}
	});
}
