var Player = (function(){
	'use strict';
	
	//////        R A W   D A T A   H E R E
	// used for initialization, validation, leveling and unlocking new skills and options
	//////        E N D   O F   D A T A
	
	function Player(user) {
		this.id = user._id;
	}
	
	Player.prototype.log = function() {
		console.log('From Player class: player id is: ' + this.id);
	}
	
	return Player;
}());