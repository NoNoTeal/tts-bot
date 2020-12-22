"use strict";
const Util = require('../../../util/essentials/Util');
const Command = require('./../../../util/essentials/Command');
class daily extends Command {
  constructor(client) {
    super(client, {
    name: 'daily',
    group: 'slots',
    syntax: 'daily',
    cooldown: 10,
    description: 'Get daily 200-300 coins.',
    })}
    async run (message, args, guild) {
        const client = message.client
        let score = client.getCoin.get(message.author.id);
        if (!score) {
            score = {
              user: message.author.id,
              amount: 0,
              dailyLimitStart: 0,
              streak: 0,
              streaks: 0,
            }
          }
          if(score.amount < 0) {score.amount=0;message.client.setCoin.run(score);}
        if(score.dailyLimitStart > Date.now() - 7.2e+7) return message.channel.send(`💳 **|** Get your daily coins in **${Math.trunc((score.dailyLimitStart - (Date.now() - 7.2e+7)) / 1000 / 60 / 60) % 60 }** hours and **${Math.trunc((score.dailyLimitStart - (Date.now() - 7.2e+7)) / 1000 /60 )% 60}** minutes!`)
        var str = ``
        if(score.dailyLimitStart > Date.now() - 1.44e+8) {
          score.streak++;
        } else {
          if(score.dailyLimitStart !== 0) {
          score.streak = -1;
          }
        }

        score.dailyLimitStart = Date.now()

        var random = Util.randomIntFromInterval(200, 300);
        var streak = 0;
      switch(score.streak) {
      case -1:
        str = `Your streak was reset! || Respond to this message again tomorrow, and for the next few days for a streak bonus!`
        score.streak = 1;
      break;
      case 0:
        str = `Respond to this message again tomorrow, and for the next few days for a streak bonus!`
      break;
      case 1:
        str = `🇸`
      break;
      case 2:
        str = `🇸 🇹`
      break;
      case 3:
        str = `🇸 🇹 🇷`
      break;
      case 4:
        str = `🇸 🇹 🇷 🇪`
      break;
      case 5:
        str = `🇸 🇹 🇷 🇪 🇦`
      break;
      case 6:
        str = `🇸 🇹 🇷 🇪 🇦 🇰
You completed the streak!`
        streak =  Util.randomIntFromInterval(50, 100);
        score.streak = -1
        score.streaks++;
      break;
          
        }
        var previous = score.amount;
        score.amount += random + streak;
        if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
        message.channel.send(`💳 **|** You now have **${previous}** coins + **${random}** coins ${score.streak == 6 ? `+ **${streak}** coins from streak bonus` : ``} = **${score.amount}** coins!
${str}`)
        client.setCoin.run(score)
    }
};
module.exports = daily;