'use strict';

var GitJokeBot = require('../lib/gitbot');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var git_joke_bot = new GitJokeBot({
    token: token,
    dbPath: dbPath,
    name: name
});

git_joke_bot.run();