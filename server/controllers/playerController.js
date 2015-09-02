var Player = require('mongoose').model('Player');
var GamePlayer = require('../../public/app/game/gamePlayer');

module.exports = {
	getPlayer: function(req, res, next) {
		Player.findOne({userId: req.user._id}).exec(function(err, p) {
			if (err) {
				console.log('Could not find player ' + err);
				return;
			}
			var player = new GamePlayer();
      player.put(p);
      player.update();
      var result = player.get();
      for (var key in p) {
        if (typeof result[key] !== 'undefined') {
          p[key] = result[key];
        }
      }
      p.save(function(err){
        if (err) {
          console.log('Error when saving player afer update operation: ' + err);
          return;
        }
        res.send(p);
      });
		});
	},
  takeAction: function(req, res, next) {
    Player.findOne({userId: req.user._id}).exec(function(err, p) {
      if (err) {
        console.log('Could not find player ' + err);
        return;
      }
      var player = new GamePlayer(), action;
      player.put(p);
      player.update();
      var result = player.get();
      for (var key in p) {
        if (typeof result[key] !== 'undefined') {
          p[key] = result[key];
        }
      }
      p.save(function(err){
        if (err) {
          console.log('Error when saving player afer update operation: ' + err);
          return;
        }
        //res.send(p);
      });
      if (typeof req._my_lastAction === 'undefined') {
				req._my_lastAction = Date.now();
				action = player.action(req.params.action);
				console.log(action);
        if(action.complete) {
					res.send({success: true, msg: action.msg});
				} else {
					res.send({success: false, msg: 'Error occurred!'});
				}
      } else if (Date.now() - req._my_lastAction > 1000) {
				action = player.action(req.params.action);
				console.log(action);
				if(action.complete) {
					res.send({success: true, msg: action.msg});
				} else {
					res.send({success: false, msg: 'Error occurred!'});
				}
      }
      //res.send({success: true});
    });
  }
}
