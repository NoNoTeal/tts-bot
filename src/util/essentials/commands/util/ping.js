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
class ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'Util',
            cooldown: 5,
            aliases: ['pong'],
            description: 'Pings bot',
            details: 'Returns nerd stuff.',

            admin: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
        var now = Date.now();
        var msg = await message.channel.send('🎾 Pinging...');
        msg.edit(`
**\`Date Method\`** | *${(Date.now() - now) / 1000} MS*
**\`Message Ping\`** | *${(msg.createdTimestamp - message.createdTimestamp) / 1000} MS*
**\`Client Ping\`** | *${message.client.ws.ping} MS*

🏓 *Pong!*`)

    }
}
module.exports = ping;