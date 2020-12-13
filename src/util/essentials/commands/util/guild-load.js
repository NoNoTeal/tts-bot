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
const Discord = require('discord.js');
class guildload extends Command {
    constructor(client) {
        super(client, {
            name: 'guildload',
            group: 'Util',
            cooldown: 5,
            syntax: 'guildload <Flags: -g, -e> <name | alias | -g: group | -e: confirm> ',
            description: 'Loads a command for a guild.',
            details: 'Loads a command a guild has unloaded. Flags -g: Target a group. -e: Target all commands.',
            channelOnly: ['guild'],
            userRequires: ['MANAGE_MESSAGES', 'BAN_MEMBERS', 'MANAGE_GUILD'],

            reqArgs: true,
            admin: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
        if(args[1]) {
            switch(args[0].toLowerCase()) {
                case '-g':
                    Command.guildLoadGroup(message, false, args[1]);
                break;
                case '-e':
                    if(args[1].toLowerCase() !== 'confirm') break;
                    Command.guildLoadGroup(message, true);
                break;
            }
        } else if(args[0]) {
            var check = message.client.path.load.get(args[0].toLowerCase()) || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args[0].toLowerCase()));
            var deleted = message.client.path.deleted.get(args[0].toLowerCase()) || message.client.path.deleted.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args[0].toLowerCase()));
            if(!check && !deleted) return message.channel.send('Command doesn\'t exist.');
            if(!check || deleted) return message.channel.send('Command has to be globally loaded.');
            Command.guildLoad(message, check);
        } else return;
    }
}
module.exports = guildload;