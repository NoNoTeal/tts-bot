"use strict";
const Util = require('../../../util/essentials/Util');
const Command = require('./../../../util/essentials/Command');
class give extends Command {
  constructor(client) {
    super(client, {
    name: 'give',
    group: 'slots',
    syntax: 'give <user> <number>',
    channelOnly: ['guild'],
    cooldown: 10,
    description: 'Give coins to a person',
    })}
    async run (message, args, guild) {
        if(message.author.id !== '329023088517971969') return message.channel.send(`This isn't for you!`)
        const client = message.client
        if(!args.length) return message.channel.send(`You need to put args, see \`${this.syntax}\``)
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
        if(!args[1]) return message.channel.send(`You didn't supply an amount of credits, see \`${this.syntax}\``)
    var before = userScore.amount
    userScore.amount = userScore.amount + parseInt(args[1])
    if(userScore.amount > 1000000000000) {userScore.amount = 1000000000000;message.client.setCoin.run(userScore);}
    client.setCoin.run(userScore)
    message.channel.send(`**${before}** -> **${userScore.amount}**`)
    }
}
module.exports=give;