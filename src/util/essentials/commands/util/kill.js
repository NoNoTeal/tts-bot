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
class kill extends Command {
    constructor(client) {
        super(client, {
            name: 'kill',
            group: 'Util',
            cooldown: 5,
            syntax: 'kill <reason>',
            description: 'Kills bot',
            details: 'Terminates Bot and exits with ID 0.',

            ownerOnly: true,
            private: true,
            admin: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
        await message.channel.send('🛑 **Stopping Bot**');
        console.log('Bot Was Terminated by ' + message.author.tag + ` ID: ${message.author.id}${args.length ? ` Reason: ${args.join(' ')}` : ''}`);
        process.exit(0);
    }
}
module.exports = kill;