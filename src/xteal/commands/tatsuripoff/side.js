var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const Util = require('../../../util/essentials/Util.js');
class side extends Command {
    constructor(client) {
        super(client, {
            name: 'side',
            cooldown: 5,
            group:'tatsumaki',
            channelOnly: ['guild'],
            reqArgs: true,
            syntax: `side <user>`,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        var user = await Util.userParsePlus(message, args, 'user');
        user = user || message.author;
        if(!user) return message.channel.send(`You didn't put a valid user! See \`${this.syntax}\``);
        if(user.user.bot) return message.channel.send(`I don't agree with bots.`);
        if(user.id == message.author.id) return message.channel.send(`I can't choose between 1 user!`);
        var selected = Math.random() >= 0.5 ? message.author : user.user;
        message.channel.send(new Discord.MessageEmbed()
        .setAuthor(`${selected.tag}`, selected.avatarURL())
        .setDescription(`I'm going to go with ${selected} on this one...`)
        .setTimestamp()
        )
    }};
module.exports = side;