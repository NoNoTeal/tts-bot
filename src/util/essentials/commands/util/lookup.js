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
class lookup extends Command {
    constructor(client) {
        super(client, {
            name: 'lookup',
            group: 'Util',
            cooldown: 5,

            syntax: 'lookup <userID>',
            description: 'Lookup a Discord User',
            details: 'Lookup a Discord User by using IDs only.',

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
        function bitNumberToArray(n) {
            const bits = [...n.toString(2)].map(Number);
        
            return bits.reduce((result, bit, index) => result.concat(bit ? bits.length - index - 1 : []), []);
        }
            try{
            var user = await message.client.api.users(args[0]).get();
            var flags = bitNumberToArray(user.public_flags);
            var str = [];
            for(var badge of flags) {
                switch(badge) {
                    case 0:
                        str.push('**Discord Employee**');
                    break;
                    case 1:
                        str.push('**Discord Partner**');
                    break;
                    case 2:
                        str.push('**Hypesquad Events**');
                    break;
                    case 3:
                        str.push('**Bug Hunter (Type Green)**');
                    break;
                    case 6:
                        str.push('**House of Bravery**');
                    break;
                    case 7:
                        str.push('**House of Brilliance**');
                    break;
                    case 8:
                        str.push('**House of Balance**');
                    break;
                    case 9:
                        str.push('**Early Supporter**');
                    break;
                    case 10:
                        str.push('**Team User**');
                    break;
                    case 12:
                        str.push('**Priority Message System**');
                    break;
                    case 14:
                        str.push('**Bug Hunter (Type Gold)**');
                    break;
                    case 16:
                        str.push('**Verified Bot**');
                    break;
                    case 17:
                        str.push('**Verified Bot Developer**');
                    break;   
                }
            }
            if(!str.length) str = ['*No Profile Badges*']
            var embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setFooter(`Used by ${message.author.tag} • This bot cannot pick up Nitro / Boosting Badges!`)
            .setTitle(`User Found!`)
            .setDescription(`User ID: **${user.id}**
    Username: **${user.username}**
    Discriminator: **${user.discriminator}**
    Profile Badges: ${str.join(', ')} || Public Flags: **${user.public_flags}**
    Tag: **${user.username}#${user.discriminator}**
    Bot: **${user.bot ? 'Yes' : 'No'}**
    Mention: <@${user.id}>
    Avatar: ${user.avatar ? `[Click Here](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256)` : 
    user.discriminator.endsWith(`0`) || user.discriminator.endsWith(`5`) ? `[Click Here](https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png)` :
    user.discriminator.endsWith(`1`) || user.discriminator.endsWith(`6`) ? `[Click Here](https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png)` :
    user.discriminator.endsWith(`2`) || user.discriminator.endsWith(`7`) ? `[Click Here](https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png)` :
    user.discriminator.endsWith(`3`) || user.discriminator.endsWith(`8`) ? `[Click Here](https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png)` :
    user.discriminator.endsWith(`4`) || user.discriminator.endsWith(`9`) ? `[Click Here](https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png)` :`Not Available`}`)
            .setImage(user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256` : 
            user.discriminator.endsWith(`0`) || user.discriminator.endsWith(`5`) ? `https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png` :
            user.discriminator.endsWith(`1`) || user.discriminator.endsWith(`6`) ? `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png` :
            user.discriminator.endsWith(`2`) || user.discriminator.endsWith(`7`) ? `https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png` :
            user.discriminator.endsWith(`3`) || user.discriminator.endsWith(`8`) ? `https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png` :
            user.discriminator.endsWith(`4`) || user.discriminator.endsWith(`9`) ? `https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png` :`Not Available`)
            message.channel.send(embed)
            } catch {message.channel.send(`User not found, here's why.
    • A user ID was not provided, get a user ID by going to \`User Settings -> Appearance (scroll down) -> Developer Mode (ON)\` and right click on someone, then press "Copy ID"
    • Your user ID was invalid, and could be a role, or channel ID.
    • Your ID leads nowhere.`)}
        }
    }
module.exports = lookup;