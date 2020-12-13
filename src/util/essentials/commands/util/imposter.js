/* 
 * I see you found my secret command stash! Or so called "secret"
 * stash. You can delete these commands, they're not required,
 * but I would recommend you keep them in. Feel free to change the
 * code as well! Also feel free to use these files as a reference
 * point when you want to make your own commands. If you think you
 * found a bug, report it on the issues tracker or make a pull rq.
 * 
 * (If you are getting rid of these, get rid of the following code
 * in Verify.js):     Command.globalReload(bot, 'util/essentials');
 */
"use strict";
const Command = require('./../../Command.js');
const {prefixes} = require('./../../../config.json');
const Discord = require('discord.js');
const CommandMessage = require('./../../CommandMessage.js');
const Util = require('../../Util.js');
class imposter extends Command {
    constructor(client) {
        super(client, {
            name: 'imposter',
            group: 'Util',
            cooldown: 5,
            syntax: 'imposter <username> <command> <command arguments>',
            description: 'Pass a command under another user.',
            details: 'Pass a command under another user. Pass a valid user under the username argument under a valid loaded command.',

            reqArgs: true,
            admin: true,
            ownerOnly: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {

        if(!args[0]) return message.channel.send(`Provide a user id.`);
        var user = await Util.userParsePlus(message, args, 'user');
        user = user || message.author;
        if(!user) return message.channel.send(`Invalid user supplied.`)
        var ms = new Discord.Message(message.client, {}, message.channel)
        ms.author = user;
        ms.content = `${prefixes[0]}${args[1]} ${args.slice(2).join(' ')}`;
        new CommandMessage(message.client, ms);
    }
}
module.exports = imposter;