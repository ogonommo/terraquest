var usersController = require('../controllers/usersController');
var planetController = require('../controllers/planetController');
var playerController = require('../controllers/playerController');

module.exports = {
    users: usersController,
    planet: planetController,
    player: playerController
}
