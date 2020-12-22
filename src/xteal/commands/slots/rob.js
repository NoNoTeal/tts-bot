"use strict";
const Util = require('../../../util/essentials/Util');
const Command = require('./../../../util/essentials/Command');
class rob extends Command {
  constructor(client) {
    super(client, {
    name: 'rob',
    group: 'slots',
    syntax: 'rob <user>',
    channelOnly: ['guild'],
    cooldown: 30,
    description: 'Rob someone, but you\'ll most likely be caught.',
    })}
    async run (message, args, guild) {
        const client = message.client
        var probability_chart = [
[30,0],
[10,1],
[5,2],
[4,3],
[3,4],
[2,5],
        ];

var reset = () => this.throttle(message.author, Date.now() + 5000);

const totalWeight = probability_chart.reduce((a, [weight]) => a + weight, 0);
const weightObj = {};
let weightUsed = 0;
for (const item of probability_chart) {
  weightUsed += item[0];
  weightObj[weightUsed] = item;
}
const keys = Object.keys(weightObj);
const generate = () => {
  const rand = Math.floor(Math.random() * totalWeight);
  const key = keys.find(key => rand < key);
  return weightObj[key][1];
};

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
        if(score.amount < 1000) {
          reset()
          return message.channel.send(`💳 **|** You need \`1000\` coins to rob people!`)}
          var user = await Util.userParsePlus(message, args, 'user');
        if(user.id == message.author.id) {
            reset()
            return message.channel.send(`💳 **|** You can't mug yourself! See \`${this.syntax}\``)}
        if(!user) {
          reset()
          return message.channel.send(`💳 **|** You didn't put a valid user! See \`${this.syntax}\``)}
        let userScore = client.getCoin.get(user.id);
        if (!userScore) {
            userScore = {
              user: user.id,
              amount: 0,
              dailyLimitStart: 0,
              streak: 0,
              streaks: 0,             
            }
        }
        if(userScore.amount < 0) {userScore.amount=0;message.client.setCoin.run(userScore);}
        if(userScore.amount < 1000) {
          reset()
        return message.channel.send(`💳 **|** You can't rob ${user} because they need \`1000\` coins!`, {allowedMentions:{parse:[],users:[],roles:[]}})
        }

        var rng = generate()
        var tax = 0.10
        var amount = 0
        switch(rng) {
          case 0:
          tax = -0.3
          break;
          case 1:
          tax = 0.1
          break;
          case 2:
          tax = 0.2
        break;
          case 3:
          tax = 0.3
        break;
        case 4:
          tax = 0.4
        break;
        case 5:
          tax = 0.5
        break;  
        }

        if(tax < 0) {
        var amount = Math.floor(score.amount > 10000 ? 10000 : score.amount * tax)
        if(amount > score.amount) {
          amount = score.amount
        }
        message.channel.send(`💳 **|** ${message.author} tried to rob ${user} and failed, being fined \`${amount}\` coins.`, {allowedMentions:{parse:[],users:[],roles:[]}})
        score.amount -= amount;
        if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
        client.setCoin.run(score);
        return 
        } else {
          var amount = Math.floor(userScore.amount > 10000 ? 10000 : userScore.amount * tax)
          if(amount > userScore.amount) {
            amount = userScore.amount;
          }
          message.channel.send(`💳 **|** ${message.author} robbed ${user} and got \`${amount}\` coins.`, {allowedMentions:{parse:[],users:[],roles:[]}});
          score.amount += amount;
          userScore.amount -= amount;
          if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
          if(userScore.amount > 1000000000000) {userScore.amount = 1000000000000;message.client.setCoin.run(userScore);}
          client.setCoin.run(score)
          client.setCoin.run(userScore)
          return 
        }

    }
}
module.exports=rob;