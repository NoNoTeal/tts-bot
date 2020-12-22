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
const { prefixes, srcDirname } = require('./../../../config.json');
const pkg = require('./../../../../../package.json');
const Util = require('../../Util.js');
class advancedhelp extends Command {
    constructor(client) {
        super(client, {
            name: 'commandstatuses',
            group: 'Util',
            syntax: 'commandstatuses <command/alias>',
            cooldown: 5,
            description: 'Help, but for the bot owner only.',
            details: 'Get a list of bot commands and check detailed information about them. Shows privated commands.',
            private: true,
            ownerOnly: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {

        /**
         * @param {Command} command
         */
        function cooldown(command) {
            var str = 'No Cooldown'
            if(typeof command.cooldown === 'number') {
                let years = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60 / 24 / 365);
                let weeks = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60 / 24 / 7) % 52.2;
                let days = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60 / 24) % 7;
                let hours = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60) % 24;
                let minutes = Math.trunc((command.cooldown * 1000) / 1000 / 60) % 60;
                let seconds = Math.trunc((command.cooldown * 1000) / 1000) % 60;
                let times = [
                    `${years <= 0 ? `` : `\`${years}\` **year${years>1?'s':''}**`}`,
                    `${weeks <= 0 ? `` : `\`${weeks}\` **week${weeks>1?'s':''}**`}`,
                    `${days <= 0 ? `` : `\`${days}\` **day${days>1?'s':''}**`}`,
                    `${hours <= 0 ? `` : `\`${hours}\` **hour${hours>1?'s':''}**`}`,
                    `${minutes <= 0 ? `` : `\`${minutes}\` **minute${minutes>1?'s':''}**`}`,
                    `${seconds <= 0 ? `` : `\`${seconds}\` **second${seconds>1?'s':''}**`}`,
                ].filter(i => i.length).join(', ');
                str = `${times.length ? times : `No Cooldown`}`;
            }
            return str;
        };

        /**
         * @param {Command} command 
         */
        function channelize(command) {
            var str = '*None*';
            if(!Array.isArray(command.channelOnly)) return '*All*';
            str = [];
            for(var ctype of command.channelOnly) {
                if(!['guild','direct','text','news'].includes(ctype.toLowerCase())) continue;
                if(str.includes(ctype.toLowerCase())) continue;
                str.push(ctype.toLowerCase());
            }
            if(str.length) return '*None*';
            return `\`${str.join('`, ')}\``;
        };

        /**
         * @param {Command} command 
         */
        function shortener(command, phase) {
            var str = '';
            phase.includes('Unloaded') || phase.includes('Disabled') ? str+=`~~` : undefined;
            str+=`**Description**: ${command.description}\n`;
            str+=`**Group**: ${command.group}\n`;
            str+=`**Cooldown**: ${cooldown(command)}\n`;
            str+=`**State**: ${phase}\n`;
            phase.includes('Unloaded') || phase.includes('Disabled') ? str+=`~~` : undefined;
            return str;
        }

        var commands = message.client.path.load;
        var filenames = message.client.path.filename;
        var unloaded = message.client.path.deleted;
        var C = 9;
    
        if(!args.length) {
        /**
         * 
         * @param {Discord.Collection} json 
         * @param {Number} cpp 
         */
          const commandList = (json, cpp=parseInt(C)) => {
                let counter = 0,
                pages = 0, 
                groupKey = `page${++pages}`,
                embed = [],
                p = {},
                eF = {},
                keys = Object.keys(json.array()),
                fc = 0,
                cmdnames = [...json.keys()];
        
              embed[groupKey] = new Discord.MessageEmbed()
              .setTitle(`**${message.client.user.username}** Commands`)
              .addField(`**Version**`, `${pkg.version}`)
              .addField(`**Prefixes**`, `${Array.isArray(prefixes) ? prefixes.join(', ') : '-'}`)
              .setTimestamp()
              p[groupKey] = embed[groupKey]
              embed[groupKey].setFooter(`Page ${groupKey.slice(4)}/${Math.ceil(keys.length / cpp)}`, message.author.avatarURL())
              return cmdnames.reduce((final, key) => {
                  var loadedCmd = commands.get(key);
                  var unloadedCmd = unloaded.get(key);
                  var finalCmd = loadedCmd ? loadedCmd : unloadedCmd;
                  var type = loadedCmd ? `Loaded` : `Unloaded`;
                  if(message.guild) {
                    var guildStatus = message.client.getGuildCommand.get(message.guild.id, key.toLowerCase());
                  }
                  if(counter === cpp) {
                  counter = 0
                  groupKey = `page${++pages}`
                  final[groupKey] = {}
                  embed[groupKey] = new Discord.MessageEmbed()
                  .setTitle(`**${message.client.user.username}** Commands`)
                  .addField(`**Version**`, `${pkg.version}`)
                  .addField(`**Prefixes**`, `${Array.isArray(prefixes) ? prefixes.join(', ') : '-'}`)
                  .setTimestamp()
        
                  embed[groupKey].setFooter(`Page ${groupKey.slice(4)}/${Math.ceil(keys.length / cpp)}`, message.author.avatarURL())
                }
                var s = ``;
                    finalCmd.private ? s+=`🅿️ ` : undefined;
                    finalCmd.ownerOnly ? s+=`🆔 ` : undefined;
                    finalCmd.admin ? s+=`🅰️ ` : undefined;
                    if(guildStatus) {
                        if(guildStatus.disabled == 1) {
                            type += `, Guild Disabled`;
                            s+=`🇬 `;
                    }}
                    type.includes('Unloaded') || type.includes('Disabled') ? s=s+`~~` : undefined;
                    s += `${finalCmd.syntax === 'No Syntax Provided' ? finalCmd.name : finalCmd.syntax}`;
                    type.includes('Unloaded') || type.includes('Disabled') ? s=s+`~~` : undefined;
                    embed[groupKey].addField(Util.trim(s, 128), `${shortener(finalCmd, type)}`, true);
                    final[groupKey] = embed[groupKey]
                    eF[groupKey] = embed[groupKey]
                    counter++
                fc++
                if(fc !== keys.length) { return final }
                else
                var m = message.channel.send(embed['page1'])
               Pagifier(eF, m)
               return 
              }, {[groupKey]: {}})
            }
        
            const Pagifier  = async (json, msg) => {
                var keys = Object.keys(json)
                if(keys.length < 2) return
              
                msg.then(async (m) => {
              
                if(m.deleted !== false) return
              else
              
                  await m.react(`◀`)
                  await m.react(`▶`)
                  await m.react(`⏏️`)
                  await m.react(`⏹️`)
              
                  let page = 1;
              
                  const backfilter = (reaction, user) => reaction.emoji.name === `◀` && user.id === message.author.id
                  const forefilter = (reaction, user) => reaction.emoji.name === `▶` && user.id === message.author.id
                  const trasfilter = (reaction, user) => reaction.emoji.name === `⏏️` && user.id === message.author.id
                  const stopfilter = (reaction, user) => reaction.emoji.name === `⏹️` && user.id === message.author.id
                  
                  const back = m.createReactionCollector(backfilter, { time: 60000})
                  const fore = m.createReactionCollector(forefilter, { time: 60000})
                  const trash = m.createReactionCollector(trasfilter, { time: 60000})
                  const stop = m.createReactionCollector(stopfilter, { time: 60000})
                  
                  back.on('collect', async (r) => {
                    if (page === 1) return
                   page--;
                   m.edit(json["page" + page])
                   if(message.guild) {
                   if(!message.guild.me.hasPermission(`MANAGE_MESSAGES`)) return
                   r.users.remove(message.author.id)
                   }
                 })
                fore.on('collect', async (r) => {
                   if (page === json.length) return
                   page++;
                   m.edit(json["page" + page])
                   if(message.guild) {
                     if(!message.guild.me.hasPermission(`MANAGE_MESSAGES`)) return
                     r.users.remove(message.author.id)
                     }
                })
                trash.on('collect', async () => {
                   m.delete()
                })
           
                stop.on('collect', async () => {
                  if(m.deleted !== false) return
                  else
                  if(message.guild) {
                  if(message.guild.me.hasPermission(`MANAGE_MESSAGES`)) {
                  m.reactions.removeAll()}
                  trash.stop()
                  fore.stop()
                  back.stop()
                  stop.stop()
                  }
                })
           
                setTimeout(async () => {
                  if(m.deleted !== false) return
                  else
                  if(message.guild) {
                  if(!message.guild.me.hasPermission(`MANAGE_MESSAGES`)) return
                  m.reactions.removeAll()
                  }
                }, 60000);
              
              })}
              commandList(filenames) 
        } else {
    var tempbed = '*No Command Found*'
    var cmd = message.client.path.load.get(args.join(' ')) || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
    var disabledCmd = message.client.path.deleted.get(args.join(' ')) || message.client.path.deleted.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
    if(!cmd && !disabledCmd) return message.channel.send(tempbed);
    if(message.guild) {
        var guildStatus = message.client.getGuildCommand.get(message.guild.id, cmd ? cmd.name.toLowerCase() : disabledCmd.name.toLowerCase());
    }
    cmd = cmd || disabledCmd;
    var status = '';
    if(guildStatus) {
        if(guildStatus.disabled == 1) {
            status+=`Guild Disabled | `;
    }}
    tempbed = new Discord.MessageEmbed()
    .setTitle(`${status}**${cmd.name}** Information`)
.setDescription(`
Under ${cmd.group ? '*' + cmd.group + '*' : '*n/a*'}
${cmd.syntax ? '`' + cmd.syntax + '`' : '`No Syntax Provided`'}
**Cooldown**: ${cmd.cooldown ? cooldown(cmd) : ''}
**Details**: ${cmd.details}
**Description**: ${cmd.description}
${cmd.nsfw ? '**NSFW**: ' + cmd.nsfw == false ? '*Use Outside of NSFW Channels*' : cmd.nsfw == true ? '*Use Inside NSFW Channels*' : '*N/A*' : ''}
**Require Arguments**: ${cmd.reqArgs ? 'Yes' : 'No'}
**Usable Channels**: ${channelize(cmd)}

**Private**: ${cmd.private ? 'Yes' : 'No'}
**Fallback**: ${cmd.private ? 'Yes' : 'No'}
**Admin**: ${cmd.admin ? 'Yes' : 'No'}
**Owner Only**: ${cmd.ownerOnly ? 'Yes' : 'No'}
**Disabled on startup**: ${cmd.disabled ? 'Yes' : 'No'}

Path:
\`${message.client.path.filename.get(cmd.name.toLowerCase()).split(`./src/${srcDirname}/commands/`).join('')}\`
`)
.setTimestamp()
if (typeof cmd.aliases !== 'undefined') {
tempbed.addField('**Aliases**', `\`${cmd.aliases.join('`, `')}\``, true);
}
if (typeof cmd.requires !== 'undefined') {
tempbed.addField('**Permissions**', `${cmd.requires.join('`, ').slice(0, 128)}`, true);
}
if (typeof cmd.userRequires !== 'undefined') {
tempbed.addField('**User Permissions**', `${cmd.userRequires.join('`, ').slice(0, 128)}`, true);
}
message.channel.send(tempbed)
    }}
}
module.exports = advancedhelp;