var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
class outofcontext extends Command {
    constructor(client) {
        super(client, {
            name: 'ooc',
            cooldown: 5,
            group:'ef',
            channelOnly: ['guild'],
            description: 'Pulls a random message from channel.',
            details: 'Pulls a random message from channel.',
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        var msgCol = (await message.channel.messages.fetch({
            limit: 100,
            before: message.id,
        })).filter(m => m.author.bot === false);
        if(msgCol.array().length < 2) return message.channel.send('Not enough messages');
        var msg = msgCol.random();
        var anotherMsg = msgCol.random();
        var apimsg = new Discord.APIMessage(msg.channel, {
            embeds: anotherMsg.embeds,
            files: anotherMsg.attachments.array(),
        })
        apimsg.data = {
            content: anotherMsg.content.length ? anotherMsg.content : `*No Content Provided*`,
            message_reference:{
                channel_id:msg.channel.id,
                guild_id:msg.guild.id,
                message_id:msg.id
            },
            allowed_mentions:{
                parse:[]
            }
        };
        message.channel.send(apimsg, {disableMentions: 'all'});
    }};
module.exports = outofcontext;