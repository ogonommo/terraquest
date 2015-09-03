var GamePlayer = (function(){
	'use strict';

	//////        R A W   D A T A   H E R E
	var rawData = {};
	//Leveling curve coefficient:
	rawData.curveIndex = 1.2;
	//Experience required for leveling for the first time:
	rawData.levelStart = 400;
	//Secons between gaining a new action point:
	rawData.actionPointTimer = 900;
	//Maximum Action points user can have at any given time:
	rawData.maxActionPoints = 50;
	//Basic resource generation (per hour)
	rawData.baseGoldStream = 10;
	rawData.baseBioniumStream = 6;
	rawData.baseQubitiumStream = 0;
	rawData.baseTransendiumStream = 0;
	//Stuff you can build or explore:
	rawData.props = [
		{
			type: 'building',
			name: 'Gold mine',
			actionId: 1,
			price: {
				gold: 300,
				bionium: 10,
				qubitium: 0,
				transendium: 0
			},
			resources: {
				gold: 20,
				bionium: 0,
				qubitium: 0,
				transendium: 0
			},
			resourceGradient: 1.25,
			priceGradient: 1.3,
			effect: {
				pollution: 1,
				water: 0,
				temperature: 0,
				kardashev: 1,
				zoosphere: 0,
				noosphere: 0,
				evolutionIndex: 0,
				vegetation: -0.1
			},
			effectGradient: 1.2,
			experience: 180,
			experienceGradient: 1.15,
			levelRequired: 1,
			maxTiers: 20,
		},
		{
			type: 'building',
			actionId: 2,
			name: 'Farmfield',
			price: {
				gold: 350,
				bionium: 50,
				qubitium: 0,
				transendium: 0
			},
			resources: {
				gold: 0,
				bionium: 12,
				qubitium: 0,
				transendium: 0
			},
			priceGradient: 1.4,
			resourceGradient: 1.22,
			effect: {
				pollution: 0,
				water: -0.3,
				temperature: -0.1,
				kardashev: 0.6,
				zoosphere: 0.3,
				noosphere: 0,
				evolutionIndex: 0.01,
				vegetation: 1.1
			},
			effectGradient: 1.2,
			experience: 210,
			experienceGradient: 1.15,
			levelRequired: 1,
			maxTiers: 20
		},
		{
			type: 'research',
			name: 'Agriculture',
			actionId: 31,
			price: {
				gold: 3000,
				bionium: 170,
				qubitium: 0,
				transendium: 0
			},
			bonus: {
				gold: 10,
				bionium: 50,
				qubitium: 0,
				transendium: 0
			},
			experience: 680,
			levelRequired: 1
		}
	];
	//////        E N D   O F   D A T A

	//////// Helper functions

	function findProp(name) {
		for (var key in rawData.props) {
			if (rawData.props[key].name === name) {
				return rawData.props[key];
			}
		}
		return false;
	}

	function findPropById(id) {
		for (var key in rawData.props) {
			if (rawData.props[key].actionId === id) {
				return rawData.props[key];
			}
		}
		return false;
	}

	function findPlayerProp(name, props) {
		for (var key in props) {
			if (props[key].name === name) {
				return props[key];
			}
		}
		return;
	}

	function generateEffect(prop, level) {
		if (prop.type === 'research') {
			return false;
		}
		var key, effect = {}, multiplier = 1;
		level -= 1;
		if (prop.type === 'building') {
			multiplier = Math.pow(prop.effectGradient, level);
		}
		for (key in prop.effect) {
			effect[key] = prop.effect[key] * multiplier;
		}
		return effect;
	}

	/// GamePlayer Class implementation

	function GamePlayer() {
		this.setup = false;
	}

	GamePlayer.prototype.log = function() {
		console.log('From Player class: player id is: ' + this.id);
	}

	GamePlayer.prototype.put = function (player) {
		if (!player) {
			throw 'Expected value for Player.put()!';
		} else {
			this.player = player;
		}
		this.PlayerData = {};
		this.PlayerData.resources = [];
		this.PlayerData.buildings = [];
		this.PlayerData.researches = [];
		this.PlayerData.tools = [];
		this.PlayerData.resourcesPerHour = [];
	};

	GamePlayer.prototype.update = function (production) {
		var now = Date.now();
		//console.log(this.player.lastAction);
		var timePassed = (now - this.player.lastAction) / 1000;
		var actionsTimePassed = (now - this.player.lastCheckpoint) / 1000;
		var key, resource, prop;
		var bonuses = [], mining = [], building, level;
		var cach = [];

		//console.log('time passed: ' + timePassed);

		if (typeof production !== 'undefined') {
			//cash player resources and time specific data
			cach['gold'] = this.player.gold;
			cach['bionium'] = this.player.bionium;
			cach['qubitium'] = this.player.qubitium;
			cach['transendium'] = this.player.transendium;
			this.PlayerData.resources = cach;
		}
		//generate action points
		var points = Math.floor(actionsTimePassed / rawData.actionPointTimer);
		this.player.actions = Math.min((this.player.actions + points), rawData.maxActionPoints);
		this.player.lastCheckpoint = now - (actionsTimePassed % rawData.actionPointTimer) * 1000;
		this.player.lastAction = now;

		//get props
		this.props = [];
		if (this.player.props.length > 0) {
			// for (key in this.player.props) {
			// 	this.props.push(this.player.props[key]);
			// 	console.log(this.props);
			// }
			for (var i = 0, len = this.player.props.length; i < len; i+=1) {
				this.props.push(JSON.parse(this.player.props[i]));
			}
		}

		//get resource multipliers and flat mining values
		for (key in this.props) {
			//miltipliers
			if (this.props[key].type === 'research') {
				prop = findProp(this.props[key].name);
				if (!prop) {
					throw 'Cannot find prop, Either undefined or invalid data in players database!';
				}
				for (resource in prop.bonus) {
					if (typeof bonuses[resource] === 'undefined') {
						bonuses[resource] = 1;
					}
					bonuses[resource] *= (100 + prop.bonus[resource]) / 100;
				}
			}
			//flat values
			if (this.props[key].type === 'building') {
				prop = findProp(this.props[key].name);
				if (!prop) {
					throw 'Cannot find prop, Either undefined or invalid data in players database!';
				}
				level = this.props[key].level;
				for (resource in prop.resources) {
					if (typeof mining[resource] === 'undefined') {
						mining[resource] = 0;
					}
					mining[resource] += prop.resources[resource] * Math.pow(prop.resourceGradient, level - 1);
				}
			}
		}

		// G O L D
		if (typeof mining['gold'] === 'undefined') {
			mining['gold'] = 0;
		}
		if (typeof bonuses['gold'] === 'undefined') {
			bonuses['gold'] = 1;
		}
		var goldPerSecond = (rawData.baseGoldStream + mining['gold']) / 3600;
		this.player.gold += goldPerSecond * timePassed * bonuses['gold'];
		this.PlayerData.resourcesPerHour['gold'] = Math.floor(goldPerSecond * 3600);

		// B I O N I U M
		if (typeof mining['bionium'] === 'undefined') {
			mining['bionium'] = 0;
		}
		if (typeof bonuses['bionium'] === 'undefined') {
			bonuses['bionium'] = 1;
		}
		var bioniumPerSecond = (rawData.baseBioniumStream + mining['bionium']) / 3600;
		this.player.bionium += bioniumPerSecond * timePassed * bonuses['bionium'];
		this.PlayerData.resourcesPerHour['bionium'] = Math.floor(bioniumPerSecond * 3600);

		// Q U B I T I U M
		if (typeof mining['qubitium'] === 'undefined') {
			mining['qubitium'] = 0;
		}
		if (typeof bonuses['qubitium'] === 'undefined') {
			bonuses['qubitium'] = 1;
		}
		var qubitiumPerSecond = (rawData.baseQubitiumStream + mining['qubitium']) / 3600;
		this.player.qubitium += qubitiumPerSecond * timePassed * bonuses['qubitium'];
		this.PlayerData.resourcesPerHour['qubitium'] = Math.floor(qubitiumPerSecond * 3600);

		//  T R A N S E N D I U M
		if (typeof mining['transendium'] === 'undefined') {
			mining['transendium'] = 0;
		}
		if (typeof bonuses['transendium'] === 'undefined') {
			bonuses['transendium'] = 1;
		}
		var transendiumPerSecond = (rawData.baseTransendiumStream + mining['transendium']) / 3600;
		this.player.transendium += transendiumPerSecond * timePassed * bonuses['transendium'];
		this.PlayerData.resourcesPerHour['transendium'] = Math.floor(transendiumPerSecond * 3600);

	};

	GamePlayer.prototype.get = function () {
		return this.player;
	};

	GamePlayer.prototype.action = function(action) {
		var prop, playerProp, effect, key, msg = '';
		var gold, bionium, qubitium, transendium, experience, level, exp;
		action = parseInt(action);
		prop = findPropById(action);
		if (!prop) {
			console.log('Invalid action id: ' + action);
			return {complete: false, result: this.player};
		}
		// If action id points to a building
		if (prop.type === 'building') {
			playerProp = findPlayerProp(prop.name, this.props);
			if (!playerProp) {
				//Building doesn't exist; create a new one and add it to props and player props
				//Check if there is enough resources for building
				if(this.player.gold < prop.price.gold || this.player.bionium < prop.price.bionium || this.player.qubitium < prop.price.qubitium || this.player.transendium < prop.price.transendium || this.player.level < prop.levelRequired) {
					return {complete: false, result: this.player};
				} else {
					this.player.gold -= prop.price.gold;
					this.player.bionium -= prop.price.bionium;
					this.player.qubitium -= prop.price.qubitium;
					this.player.transendium -= prop.price.transendium;
					this.player.actions -= 1;
					this.player.experience += prop.experience;
					this.props.push({type: prop.type, name: prop.name, level: 1});
					effect = generateEffect(prop, 1);
					msg = prop.name + ' has been constructed!';
				}
			} else {
				//building is already owned by the player, get reference and update this.props
				//check if maximum tier is reached
				if (playerProp.level >= prop.maxTiers) {
					return {complete: false, result: this.player};
				}
				level = playerProp.level;
				gold = prop.price.gold * Math.pow(prop.priceGradient, level);
				bionium = prop.price.bionium * Math.pow(prop.priceGradient, level);
				qubitium = prop.price.qubitium * Math.pow(prop.priceGradient, level);
				transendium = prop.price.transendium * Math.pow(prop.priceGradient, level);
				//Check if there is enough resources for building
				if (this.player.gold < gold || this.player.bionium < bionium || this.player.qubitium < qubitium || this.player.transendium < transendium) {
					return {complete: false, result: this.player};
				}
				this.player.gold -= gold;
				this.player.bionium -= bionium;
				this.player.qubitium -= qubitium;
				this.player.transendium -= transendium;
				this.player.actions -= 1;
				this.player.experience += prop.experience * Math.pow(prop.experienceGradient, level);
				playerProp.level += 1;
				effect = generateEffect(prop, level + 1);
				msg = prop.name + ' has been upgraded!';
			}
		}

		//if action points to a research
		if (prop.type === 'research') {
			playerProp = findPlayerProp(prop.name, this.props);
			if (playerProp) {
				//Player had already completed this research
				return {complete: false, result: this.player};
			} else {
				if (this.player.gold < prop.price.gold || this.player.bionium < prop.price.bionium || this.player.qubitium < prop.price.qubitium || this.player.transendium < prop.price.transendium || this.player.level < prop.levelRequired) {
					return {complete: false, result: this.player};
				}
				this.player.gold -= prop.price.gold;
				this.player.bionium -= prop.price.bionium;
				this.player.qubitium -= prop.price.qubitium;
				this.player.transendium -= prop.price.transendium;
				this.player.actions -= 1;
				this.player.experience += prop.experience;
				this.props.push[{type: prop.type, name: prop.name, level: 1}];
				effect = generateEffect(prop, 1);
				msg = prop.name + ' has been researched!';
			}
		}

		//if action points to a tool
		if (prop.type === 'tool') {
			//Check resource and level requirements
			if (this.player.gold < prop.price.gold || this.player.bionium < prop.price.bionium || this.player.qubitium < prop.price.qubitium || this.player.transendium < prop.price.transendium || this.player.level < prop.levelRequired) {
				return {complete: false, result: this.player};
			}
			this.player.gold -= prop.price.gold;
			this.player.bionium -= prop.price.bionium;
			this.player.qubitium -= prop.price.qubitium;
			this.player.transendium -= prop.price.transendium;
			this.player.actions -= 1;
			this.player.experience += prop.experience;
			effect = generateEffect(prop, 1);
			msg = prop.name + ' has been executed!';
		}

		//update player experience level
		//level = 1;
		for (var i = 2; i <101; i+=1) {
			exp = rawData.levelStart * Math.pow(rawData.curveIndex, i - 2);
			if (this.player.experience >= exp) {
				this.player.level = i;
			}
		}

		//empty player.props and populate with stringified this.prop valies
		this.player.props = [];
		for (key in this.props) {
			this.player.props.push(JSON.stringify(this.props[key]));
		}
		console.log(this.props);
		console.log(effect);
		return {complete: true, result: this.player, effect: effect, msg: msg};
	}

	GamePlayer.prototype.export = function () {
		this.PlayerData.buildings = [];
		this.PlayerData.researches = [];
		this.PlayerData.tools = [];
		this.PlayerData.player = {};
		var key, prop, data, playerProp;
		var exportProp, rawProp;
		for (var key in rawData.props) {
			prop = rawData.props[key];
			if (prop.levelRequired <= this.player.level) {
				//console.log('in export');
				// populate available buildings, researches and tools
				// buildings first
				if (prop.type === 'building') {
					//console.log('detected a building prop');
					playerProp = findPlayerProp(prop.name, this.props);
					if (playerProp) {
						//Player already has this prop
						//console.log('player has: ' + prop.name);
						rawProp = findProp(playerProp.name);
						exportProp = {};
						exportProp.name = playerProp.name;
						exportProp.level = playerProp.level;
						exportProp.prop = prop;
						if (playerProp.level < rawProp.maxTiers) {
							exportProp.upgrade = true;
						} else {
							exportProp.upgrade = false;
						}
						this.PlayerData.buildings.push(exportProp);
					} else {
						//rawProp = findProp(prop.name);
						exportProp = {};
						exportProp.name = prop.name;
						exportProp.level = 0;
						exportProp.price = prop.price;
						exportProp.upgrade = true;
						exportProp.prop = prop;
						this.PlayerData.buildings.push(exportProp);
					}
				}
				// then researches
				if (prop.type === 'research') {
					playerProp = findPlayerProp(prop.name, this.props);
					//console.log('detected a research');
					if (playerProp) {
						//Player already has this prop, do nothing
					} else {
						exportProp = {};
						exportProp.name = prop.name;
						exportProp.upgrade = true;
						exportProp.price = prop.price;
						exportProp.prop = prop;
						this.PlayerData.researches.push(exportProp);
					}
				}
				//then tools
				if (prop.type === 'tool') {
					exportProp = {};
					exportProp.name = prop.name;
					exportProp.price = prop.price;
					exportProp.upgrade = true;
					exportProp.prop = prop;
					this.PlayerData.tools.push(exportProp);
				}
			}
		}
		//then player information
		var baseLevel, nextLevel;
		this.PlayerData.player.level = this.player.level;
		this.PlayerData.player.experience = this.player.experience;
		if (this.player.level === 1) {
			baseLevel = 0;
			nextLevel = rawData.levelStart;
		} else {
			baseLevel = rawData.levelStart * Math.pow(rawData.curveIndex, this.player.level - 2);
			nextLevel = baseLevel * rawData.curveIndex;
		}
		this.PlayerData.player.baseLevel = baseLevel;
		this.PlayerData.player.nextLevel = nextLevel;
		this.PlayerData.player.levelComplete = (this.player.experience - baseLevel) / (nextLevel - baseLevel);
		return this.PlayerData;
	};

	return GamePlayer;
}());


var module = module || {};
module.exports = GamePlayer;
