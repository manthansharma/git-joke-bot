var mongoose = require('./connect');
var Schema = mongoose.Schema;

var jokeSchema = new Schema({
    text: String,
    used_count: {type: Number, default: 0}
});

jokeSchema.statics.random = function (callback) {
    this.count(function (err, count) {
        if (err) {
            return callback(err);
        }
        var rand = Math.floor(Math.random() * count);
        this.findOne().skip(rand).exec(callback);
    }.bind(this));
};


jokeSchema.methods.used_increment = function (callback) {
    this.used_count++;
    this.save(callback);
};

var Joke = mongoose.model('Joke', jokeSchema);

module.exports = Joke;