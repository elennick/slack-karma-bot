var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: 'xoxb-62527700996-qW72iJUXGcLiai4TOxPhy5Oa'
});

var users = [];

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(["^@.*\\+\\+$"],["ambient"],function(bot,message) {
  bot.reply(message,'You said ' + message.text);

  // var username = message.text
});
