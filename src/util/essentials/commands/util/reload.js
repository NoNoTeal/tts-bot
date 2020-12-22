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
class reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            group: 'Util',
            syntax: 'reload <Flags: -g, -e> <command (aliases supported!) | -g: group | -e: confirm>',
            cooldown: 5,
            description: 'Reload a (or every) command',
            details: 'Reload a command that is unloaded. Guild owners cannot do this. Flag -g: Target a group. -e: Target all commands. Targeting a group or everything results in new commands being added to the bot.',

            reqArgs: true,
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

        if(args[1]) {
            switch(args[0].toLowerCase()) {
                case '-g':
                    Command.reloadGroup(message, false, args.slice(1).join(' '));
                break;
                case '-e':
                    if(args[1].toLowerCase() !== 'confirm') {
                        message.channel.send('If you are wanting to reload everything... try `reload -e confirm`')
                        break;
                    }
                    Command.reloadGroup(message, true);
                break;
            }
        } else if(args[0]) {
            var path = message.client.path.deleted.get(args[0].toLowerCase()) || message.client.path.deleted.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args[0].toLowerCase()));
            var check = message.client.path.load.get(args[0].toLowerCase())  || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args[0].toLowerCase()));
            if(path) return message.channel.send(`Command / alias \`${args[0]}\` has to be loaded.`);
            if(!check) return message.channel.send(`Command / alias \`${args[0]}\` can't be found.`);
            var command = require(message.client.path.filename.get(check.name.toLowerCase()).replace('src', '../../../..'));
            Command.reload(message, command);
        } else return;
    }
}
module.exports = reload;