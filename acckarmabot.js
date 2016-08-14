var Botkit = require('botkit');
var PropertiesReader = require('properties-reader');

var botName;
var slackToken;
var storageLocation;

var loadProperties = function() {
    var properties = PropertiesReader('bot.properties');

    slackToken = properties.get('slack.token');
    botName = properties.get('bot.name');
    storageLocation = properties.get('storage.location');
}

var initBot = function(controller) {
    console.log('Using slack token: ' + slackToken);
    var bot = controller.spawn({
        token: slackToken
    }).startRTM(function(err, bot, payload) {
        if (err) {
            throw new Error('Could not connect to Slack');
        }
    });
    console.log("Bot initialized.");
    return bot;
};

var initArticles = function(controller) {
    var articles = [];

    var article1 = {};
    article1.name = 'Climbing the infinite ladder of abstraction';
    article1.link = 'https://lexi-lambda.github.io/blog/2016/08/11/climbing-the-infinite-ladder-of-abstraction/';
    article1.date = Date.now();
    article1.meta = '';
    articles.push(article1);

    console.log(controller.storage);
    console.log(controller.storage.teams);
    controller.storage.teams.save({
        id: article1.name,
        article: article1
    }, function(err) {
        console.log("Error persisting article! " + err);
    });

    var article2 = {};
    article2.name = 'S.O.L.I.D. Principles';
    article2.link = 'http://yashchenkon.tech/SOLID/';
    article2.date = Date.now();
    article2.meta = '';
    articles.push(article2);

    // controller.storage.teams.save({
    //     id: article2.name,
    //     article: article2
    // }, function(err) {
    //     console.log("Error persisting article! " + err);
    // });

    var article3 = {};
    article3.name = 'The rise and fall of the Gopher protocol';
    article3.link = 'https://www.minnpost.com/business/2016/08/rise-and-fall-gopher-protocol';
    article3.date = Date.now();
    article3.meta = '';
    articles.push(article3);

    // controller.storage.teams.save({
    //     id: article3.name,
    //     article: article3
    // }, function(err) {
    //     console.log("Error persisting article! " + err);
    // });

    return articles;
};

loadProperties();
var controller = Botkit.slackbot({
    json_file_store: storageLocation
});
var articles = initArticles(controller);
var bot = initBot(controller);

var respond = function(bot, message) {
    if (message.text.match(/random/gi)) {
        var article = articles[Math.floor(Math.random() * articles.length)];

        var responseText;
        if (article.name !== undefined) {
            responseText = article.name + ": " + article.link;
        } else {
            responseText = article.link;
        }

        bot.reply(message, {
            text: responseText,
            username: botName,
            icon_emoji: ":unicorn_face:",
        });
    }
};

controller.hears(["^@" + botName], ["ambient"], function(bot, message) {
    console.log("name heard ambiently");
    respond(bot, message);
});

controller.on('direct_mention', function(bot, message) {
    console.log("name heard directly");
    respond(bot, message);
});
