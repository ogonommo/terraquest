var mongoose = require('mongoose');

var PlayerSchema = mongoose.Schema({
	id: String,
	level: Number,
	experience: Number,
	lastCheckpoint: Date
}, {collection: 'player'});

var Player = mongoose.model('Player', PlayerSchema);