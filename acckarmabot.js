var Botkit = require('botkit');
var PropertiesReader = require('properties-reader');

var getSlackToken = function() {
  var properties = PropertiesReader('bot.properties');
  var token = properties.get('slack.token');
  console.log("Loaded Slack token: " + token);
  return token;
};

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: getSlackToken()
}).startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(["^@.*\\+\\+$"],["ambient"],function(bot,message) {
  bot.reply(message,'You said ' + message.text);

  // var username = message.text
});
