var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
	name: String,
	createdAt: Date,
	description: String,
	priority: Number
}, {collection: 'events'});

var Event = mongoose.model('Event', EventSchema);