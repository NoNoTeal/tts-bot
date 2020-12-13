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
class guildprefix extends Command {
    constructor(client) {
        super(client, {
            name: 'guildprefix',
            group: 'Util',
            cooldown: 5,
            syntax: 'guildprefix <prefix|none>',
            description: 'Changes prefix but for a guild.',
            details: 'Change prefix exclusively to a guild. (Type "none" if you want to remove the prefix)',
            channelOnly: ['guild'],
            userRequires: ['MANAGE_MESSAGES', 'BAN_MEMBERS', 'MANAGE_GUILD'],

            admin: true,
            reqArgs: true
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
            if(args[0].toLowerCase() !== "none") {
            message.channel.send(`This guild prefix was changed from \`${message.client.getGuildPrefix.get(guild.id) ? message.client.getGuildPrefix.get(guild.id).prefix : 'none'}\` -> \`${args[0]}\`.`);
            message.client.setGuildPrefix.run({prefix: args[0], guild: guild.id});
            } else {
                message.client.deleteGuildPrefix.run(guild.id);
                message.channel.send(`The guild prefix was reset.`);
            };
    }
}
module.exports = guildprefix;