var Botkit = require('botkit');
var PropertiesReader = require('properties-reader');

const NAME = "KarmaBot";

var users = [];

var getSlackToken = function() {
  var properties = PropertiesReader('bot.properties');
  var token = properties.get('slack.token');
  console.log("Loaded Slack token: " + token);
  return token;
};

var controller = Botkit.slackbot();

var initBot = function(controller) {
  var bot = controller.spawn({
    token: getSlackToken()
  }).startRTM(function(err,bot,payload) {
    if (err) {
      throw new Error('Could not connect to Slack');
    }
  });
  console.log("Bot initialized.");
  return bot;
};

var bot = initBot(controller);

controller.hears(["^@.*\\+\\+$"],["ambient"],function(bot,message) {
  bot.reply(message,{
    text: "You said: '" + message.text + "'",
    username: NAME,
    icon_emoji: ":unicorn_face:",
  });

  var user = users[message.text];
  console.log(user);
  if(user === undefined) {
    user = {};
    user.karma = 1;
    users[message.text] = user;
  } else {
    user.karma += 1;
  }

  console.log(users);
});
