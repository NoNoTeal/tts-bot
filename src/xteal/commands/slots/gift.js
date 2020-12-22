"use strict";
const Command = require('./../../../util/essentials/Command');
var Discord = require('discord.js');
const Util = require('../../../util/essentials/Util');
class gift extends Command {
  constructor(client) {
    super(client, {
    name: 'gift',
    group: 'slots',
    syntax: 'gift <user> <amount>',
    channelOnly: ['guild'],
    requires: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    cooldown: 10,
    description: 'Give someone coins with 10% tax.',
    })}
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {*} guild 
     */
    async run (message, args, guild) {
        const client = message.client;
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
        if(score.amount < 0) {score.amount=0;message.client.setCoin.run(score); }
        if(!args.length) return message.channel.send(`💳 **|** You need to put args, see \`${this.syntax}\``)
        var user = await Util.userParsePlus(message, args, 'user');
        user = user || message.author;
        if(!user) return message.channel.send(`💳 **|** You didn't put a valid user! See \`${this.syntax}\``)
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
        if(user.bot && user.id == message.author.id) return message.channel.send(`💳 **|** You can't give credits to a bot or yourself.`)
        if(!args[1]) return message.channel.send(`💳 **|** You didn't supply an amount of coins, see \`${this.syntax}\``)
        if(parseInt(args[1]) > score.amount) return message.channel.send(`💳 **|** You can't afford to give this much!`)
        if(parseInt(args[1]) > 10000) args[1] = 10000;
        if(parseInt(args[1]) < 20) args[1] = 20;
        if(isNaN(args[1])) args[1] = 20;
        var tax = 0.10;
        var finalCoin = Math.floor(args[1] - args[1] * tax);
        var confirmationId = Math.random().toString(16).substr(2, 16).toLowerCase();
        var con = await message.channel.send(`💳 **|** You want to give **${finalCoin}** coins (${args[1]} with 10% tax) to ${user}?
**To**: ${user}, **From**: ${message.author}
**Confirm Transaction**: Type \`${confirmationId}\`
(To calculate tax, see the tax command)
**Your Balance**: \`${score.amount}\` **-** \`${finalCoin}\` **=** \`${score.amount - finalCoin}\`
**Other Balance**: \`${userScore.amount}\` **+** \`${finalCoin}\` **=** \`${userScore.amount + finalCoin}\``, {allowedMentions:{parse:[],users:[],roles:[]}});

const filter = msg => msg.author.id === message.author.id;
var collector = message.channel.createMessageCollector(filter, { time: 20000 });
collector.on('collect', async (m) => {
    if(m.content.toLowerCase().includes(confirmationId)) {
    var msg = await message.channel.send(`💳 **|** Transaction Commencing!`)
    score.amount -= finalCoin;
    userScore.amount += finalCoin;
    if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
    if(userScore.amount > 1000000000000) {userScore.amount = 1000000000000;message.client.setCoin.run(userScore);}
    await client.setCoin.run(score);
    await client.setCoin.run(userScore);
    try{m.delete()} catch{}
    msg.edit(`💳 **|** Transaction Complete!`);
    collector.stop();
    return;
    } else
    if(m.content.toLowerCase() === 'cancel') {
    var msg = await message.channel.send(`💳 **|** Transaction Cancelled!`);
    collector.stop();
    try{m.delete()} catch{}
    if(!con.deleted) {
    con.delete();
    };
    return;
    };
});

collector.on('end', () => {
    if(!con.deleted) {
        con.edit(`💳 **|** ||You want to give **${finalCoin}** coins (${args[1]} with 10% tax) to ${user}?
        **To**: ${user}, **From**: ${message.author}
        **Confirm Transaction**: Type \`${confirmationId}\`
        (To calculate tax, see the tax command)
        **Your Balance**: \`${score.amount}\` **-** \`${finalCoin}\` **=** \`${score.amount - finalCoin}\`
        **Other Balance**: \`${userScore.amount}\` **+** \`${finalCoin}\` **=** \`${userScore.amount + finalCoin}\`||`, {allowedMentions:{parse:[],users:[],roles:[]}})
    }
})

    }
};
module.exports = gift;