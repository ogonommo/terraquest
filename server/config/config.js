var path = require('path');
var rootPath = path.normalize(__dirname + '/../../')

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://tester:t3st3r@ds040898.mongolab.com:40898/ogonommic',
        port: process.env.PORT || 3001
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://tester:t3st3r@ds040898.mongolab.com:40898/ogonommic',
        port: process.env.PORT || 3001
    }
}
