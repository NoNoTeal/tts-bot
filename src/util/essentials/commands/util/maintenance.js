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
class maintenance extends Command {
    constructor(client) {
        super(client, {
            name: 'maintenance',
            group: 'Util',
            cooldown: 5,
            syntax: 'maintenance <flag -s> <note>',
            description: 'Enters maintenance mode.',
            details: 'Makes all commands except essentials/commands/util owner only, and changes bot status. Use flag -s to exit this mode. Helpful for working on new commands, and you necessarily don\'t want users to touch these commands. Also enables a mode where cooldowns are **not** applied to users.',

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
        function run() {
            message.channel.send('🛠️ **Entering maintenance mode. Do \`maintenance -s <reason>\` to exit.**');
            if(message.client.path.util.maintenance) return message.channel.send(`Bot is already in maintenance mode.`)
            console.log('Bot entering maintenance mode... Executed by: ' + message.author.tag + ` ID: ${message.author.id}${args.length ? ` Reason: ${args.join(' ')}` : ''}`);
            message.client.path.util.maintenance = true;
            message.client.user.setPresence({
                activity: {
                    name: "🛠️ Myself being worked on. Not available currently, in maintenance mode.",
                    type: "WATCHING",
                },
                afk: true,
                status: "dnd",
            });
            message.channel.send(`**Entered maintenance mode.**`);
        }
        if(args[0]) {
            if(args[0].toLowerCase() == '-s') {
                if(!message.client.path.util.maintenance) return message.channel.send(`Bot is not in maintenance mode.`);
                console.log('Bot exiting maintenance mode... Executed by: ' + message.author.tag + ` ID: ${message.author.id}${args.slice(1, args.length).length ? ` Reason: ${args.slice(1, args.length).join(' ')}` : ''}`);
                message.client.path.util.maintenance = null;
                message.client.user.setPresence({
                    afk: false,
                    status: "online",
                    activity: {
                        name: "🛠️ Myself Leave Maintenance Mode.",
                        type: 'WATCHING'
                    }
                });
                message.channel.send(`**Exited maintenance mode.**`);
        }else run();}else run();
    };
};
module.exports = maintenance;