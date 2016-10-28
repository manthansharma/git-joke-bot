'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var Joke = require('../data/joke_model');

var GitJokeBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'gitjoke';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'gitbot.db');

    this.user = null;
    this.db = null;
};

util.inherits(GitJokeBot, Bot);

module.exports = GitJokeBot;

GitJokeBot.prototype.run = function () {
    GitJokeBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

GitJokeBot.prototype._onStart = function () {
    this._loadBotUser();
    this._firstRunCheck();
};

GitJokeBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

GitJokeBot.prototype._firstRunCheck = function () {
    // var self = this;
    // self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
    //     if (err) {
    //         return console.error('DATABASE ERROR:', err);
    //     }
    //
    //     var currentTime = (new Date()).toJSON();
    //
    //     // this is a first run
    //     if (!record) {
    //         self._welcomeMessage();
    //         return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
    //     }
    //
    //     // updates with new last running time
    //     self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    // });
};

GitJokeBot.prototype._welcomeMessage = function () {
    // this.postMessageToChannel(this.channels[0].name, 'Hi guys, roundhouse-kick anyone?' +
    //     '\n I can tell jokes, but very honest ones. Just say `git pull` or `' + this.name + '` to invoke me!',
    //     {as_user: true});
};

GitJokeBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) && !this._isFromGitJokeBot(message) &&
        this._isChannelConversation(message) && this._isMentioningGitPullJoke(message)) {
        this._replyWithRandomJoke(message);
    }
};

GitJokeBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

GitJokeBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

GitJokeBot.prototype._isFromGitJokeBot = function (message) {
    return message.user === this.user.id;
};

GitJokeBot.prototype._isMentioningGitPullJoke = function (message) {
    return message.text.toLowerCase().indexOf('git pull joke') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};


GitJokeBot.prototype._replyWithRandomJoke = function (originalMessage) {
    var self = this;
    Joke.random(function (err, joke) {
        if (err) {
            console.log(err);
        }
        var channel = self._getChannelById(originalMessage.channel);
        console.log(joke.text);
        self.postMessageToChannel(channel.name, joke.text, {as_user: true});
        joke.used_increment(function (err, data) {
            if (err) {
                console.log(err);
            }
        })
    })
};

GitJokeBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};
