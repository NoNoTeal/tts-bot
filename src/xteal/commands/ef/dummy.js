var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
class dummy extends Command {
    constructor(client) {
        super(client, {
            name: 'fakegen',
            cooldown: 5,
            group:'ef',
            syntax: 'fakegen <name>',
            channelOnly: ['guild'],
            description: 'Generates a fake first join message for specified user.',
            details: 'Generates a fake first join message for specified user. Defaults to Alco_Rs11',
        })
    }
    async run(message, args) {
    var ign = args[0] || 'Alco_Rs11';
    var embed = new Discord.MessageEmbed();
        embed.setDescription(`Generated Dummy Join`)
        .setAuthor(`${ign} joined the server for the first time`)
        .setColor([255, 215, 0])
        .setTimestamp()
        message.channel.send(embed)
    }};
module.exports = dummy;