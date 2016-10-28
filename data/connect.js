var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/git_joke_bot');
mongoose.Promise = require('bluebird');

module.exports = mongoose;