const Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
class viewmark extends Command {
    constructor(client) {
        super(client, {
            name: 'viewmarklist',
            cooldown: 3,
            group:'ef',
            channelOnly: ['guild'],
            description: 'Check the whole list.',
            details: 'View a list of all the people marked.',
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async run(message, args) {
        var mark = require('./../../cache/mark.json');
        var embed = new Discord.MessageEmbed();
        embed.setDescription(`\`${mark.join('`, `').length ? mark.join('`, `') : `No one is here.`}\``.slice(0, 2048));
        message.channel.send(embed)
    }};
module.exports = viewmark;