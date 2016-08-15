var Botkit = require('botkit');
var PropertiesReader = require('properties-reader');
var articlesUtils = require('./articles');

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

var validateUrl = function(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

var initArticles = function(controller) {
    var articles = [];

    var article1 = {};
    article1.name = 'Climbing the infinite ladder of abstraction';
    article1.link = 'https://lexi-lambda.github.io/blog/2016/08/11/climbing-the-infinite-ladder-of-abstraction/';
    article1.date = Date.now();
    article1.meta = '';
    articles.push(article1);

    var article2 = {};
    article2.name = 'S.O.L.I.D. Principles';
    article2.link = 'http://yashchenkon.tech/SOLID/';
    article2.date = Date.now();
    article2.meta = '';
    articles.push(article2);

    var article3 = {};
    article3.name = 'The rise and fall of the Gopher protocol';
    article3.link = 'https://www.minnpost.com/business/2016/08/rise-and-fall-gopher-protocol';
    article3.date = Date.now();
    article3.meta = '';
    articles.push(article3);

    articlesUtils.saveArticle(controller, article1);
    articlesUtils.saveArticle(controller, article2);
    articlesUtils.saveArticle(controller, article3);

    return articles;
};

loadProperties();
var controller = Botkit.slackbot({
    json_file_store: storageLocation
});
var articles = initArticles(controller);
var bot = initBot(controller);

// controller.hears(["^@" + botName], ["ambient"], function(bot, message) {
//     console.log("name heard ambiently");
//     respond(bot, message);
// });

controller.on('direct_mention', function(bot, message) {
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
});

controller.on([], 'direct_mention', function(bot, message) {
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
});
