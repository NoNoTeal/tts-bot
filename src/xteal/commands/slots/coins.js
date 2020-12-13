"use strict";
const Util = require('../../../util/essentials/Util');
const Command = require('./../../../util/essentials/Command');
class coins extends Command {
  constructor(client) {
    super(client, {
      name: 'coins',
      group: 'slots',
      syntax: 'coins <user>',
      cooldown: 5,
      description: 'Check how many coins you have.',
    })}
    async run (message, args, guild) {
    const client = message.client;
    var user = await Util.userParsePlus(message, args, 'user');
    if(!user) return message.channel.send(`User doesn't exist.`);
    if(user.bot) return message.channel.send(`💳 **|** Bots can't have money.`);
    let score = client.getCoin.get(user.id);
    let profile = client.getInfo.get(user.id);
    if (!score) {
      score = {
        user: user.id,
        amount: 0,
        dailyLimitStart: 0,
        streak: 0,
        streaks: 0,   
      }
      message.client.setCoin.run(score);
  }
  if(score.amount < 0) {score.amount=0;message.client.setCoin.run(score);}
  if (!profile) {
      profile = {
          user: user.id,
          infotext: "I'm a person.",
          rep: 0,
          level: 1,
          xp: 0,
          badges: JSON.stringify([]),
      }
      message.client.setInfo.run(profile);
  }
  var badges = JSON.parse(profile.badges);
    if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
    message.channel.send(`💳 **|** ${user.id == message.author.id ? `You have` : `${user} has`} **${score.amount}** coins ${score.amount > 10000 ? `💎` : score.amount > 1000 ? `💰` : score.amount > 500 ? `💵` : score.amount > 250 ? `💸` : score.amount > 50 ? `💳` : ``}`, {allowedMentions:{parse:[],users:[],roles:[]}})
      if(score.amount >= 5000) {
        giveBadge([`💵`, `Some credits...`]);
      }
      if(score.amount >= 10000) {
        giveBadge([`💰`, `Robbed a bank.`]);
      }
      if(score.amount >= 50000) {
        giveBadge([`🔫`, `Wheres your credit card?`]);
      }
      if(score.amount >= 100000) {
        giveBadge([`👑`, `Rich as a king`]);
      }
      if(score.amount >= 500000) {
        giveBadge([`📦`, `Box full of money`]);
      }
      if(score.amount >= 1000000) {
        giveBadge([`🤯`, `Money overload`]);
      }

      function giveBadge(name) {
        if(badges.find(v => JSON.stringify(v) === JSON.stringify(name))) return;
        badges.push(name);
        profile.badges = JSON.stringify(badges);
        message.channel.send(`📛 **|** Also, ${message.author} received a badge! ${name[0]} **|** ${name[1]}`, {allowedMentions:{parse: [],roles:[], users:[]}});
        client.setInfo.run(profile);
      }
    }
};

module.exports = coins;