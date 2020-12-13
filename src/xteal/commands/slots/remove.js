"use strict";
const Util = require('../../../util/essentials/Util');
const Command = require('./../../../util/essentials/Command');
class remove extends Command {
  constructor(client) {
    super(client, {
    name: 'remove',
    group: 'slots',
    syntax: 'remove <user> <number>',
    channelOnly: ['guild'],
    cooldown: 10,
    description: 'Remove coins from a person',
    })}
    async run (message, args, guild) {
        if(message.author.id !== '329023088517971969') return message.channel.send(`This isn't for you!`)
        const client = message.client
        var newArgs = []
        for(var a of args) {
            newArgs.push(a.match(/\d+/g)[0])
        }
        if(!newArgs.length) return message.channel.send(`You need to put args, see \`${this.syntax}\``)
        var user = await Util.userParsePlus(message, args, 'user');
        user = user || message.author;
        if(!user) return message.channel.send(`You didn't put a user! See \`${this.syntax}\``)
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
        if(!newArgs[1]) return message.channel.send(`You didn't supply an amount of coins, see \`${this.syntax}\``)
    var before = userScore.amount
    userScore.amount = userScore.amount - parseInt(newArgs[1])
    if(userScore.amount > 1000000000000) {userScore.amount = 1000000000000;message.client.setCoin.run(userScore);}
    client.setCoin.run(userScore)
    message.channel.send(`**${before}** -> **${userScore.amount}**`)
    }
}
module.exports=remove;