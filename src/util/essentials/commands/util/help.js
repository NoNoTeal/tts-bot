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
class help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'Util',
            syntax: 'help <command/alias>',
            cooldown: 5,
            description: 'Get a list of bot commands',
            details: 'Get a list of bot commands and check detailed information about them.',
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
                let years = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60 / 24 / 365) % 365;
                let weeks = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60 / 24 / 7) % 7;
                let days = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60 / 24) % 24;
                let hours = Math.trunc((command.cooldown * 1000) / 1000 / 60 / 60) % 60;
                let minutes = Math.trunc((command.cooldown * 1000) / 1000 / 60) % 60;
                let seconds = Math.trunc((command.cooldown * 1000) / 1000) % 60;
                let times = [
                    `${years <= 0 ? `` : `\`${years}\` **year(s)**`}`,
                    `${weeks <= 0 ? `` : `\`${weeks}\` **week(s)**`}`,
                    `${days <= 0 ? `` : `\`${days}\` **day(s)**`}`,
                    `${hours <= 0 ? `` : `\`${hours}\` **hour(s)**`}`,
                    `${minutes <= 0 ? `` : `\`${minutes}\` **minute(s)**`}`,
                    `${seconds <= 0 ? `` : `\`${seconds}\` **second(s)**`}`,
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
            if(!Array.isArray(command.channelOnly)) return str;
            str = [];
            for(var ctype of command.channelOnly) {
                if(!['guild','direct','text','news'].includes(ctype.toLowerCase())) continue;
                if(str.includes(ctype.toLowerCase())) continue;
                str.push(ctype.toLowerCase());
            }
            return `\`${str.join('`, ')}\``;
        };

        /**
         * @param {Command} command 
         */
        function shortener(command, phase) {
            var str = '';
            str+=`**Description**: ${command.description}\n`;
            str+=`**Group**: ${command.group}\n`;
            str+=`**Cooldown**: ${cooldown(command)}\n`;
            str+=`**State**: ${phase}\n`;
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
              embed[groupKey].setFooter(`Page ${groupKey.slice(4)}/${Math.floor(keys.length / cpp)}`, message.author.avatarURL())
              return cmdnames.reduce((final, key) => {
                  var loadedCmd = commands.get(key);
                  var unloadedCmd = unloaded.get(key);
                  var finalCmd = loadedCmd ? loadedCmd : unloadedCmd;
                  var type = loadedCmd ? `Loaded` : `Unloaded`;
                  var guildStatus = message.client.getGuildCommand.get(message.guild.id, key.toLowerCase());
                  if(guildStatus) {
                  if(guildStatus.disabled == 1) {
                      type += `, Guild Disabled`;
                  }}
                  if(counter === cpp) {
                  counter = 0
                  groupKey = `page${++pages}`
                  final[groupKey] = {}
                  embed[groupKey] = new Discord.MessageEmbed()
                  .setTitle(`**${message.client.user.username}** Commands`)
                  .addField(`**Version**`, `${pkg.version}`)
                  .addField(`**Prefixes**`, `${Array.isArray(prefixes) ? prefixes.join(', ') : '-'}`)
                  .setTimestamp()
        
                  embed[groupKey].setFooter(`Page ${groupKey.slice(4)}/${Math.floor(keys.length / cpp)}`, message.author.avatarURL())
                }
                if(finalCmd.private !== true) {
                    embed[groupKey].addField(`${finalCmd.syntax === 'No Syntax Provided' ? finalCmd.name : finalCmd.syntax}`, `${shortener(finalCmd, type)}`, true)
                    final[groupKey] = embed[groupKey]
                    eF[groupKey] = embed[groupKey]
                    counter++
                }
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
                      if(!message.guild.me.hasPermission(`MANAGE_MESSAGES`)) return
                      r.users.remove(message.author.id)
                      })
                   fore.on('collect', async (r) => {
                      if (page === json.length) return
                      page++;
                      m.edit(json["page" + page])
                      if(!message.guild.me.hasPermission(`MANAGE_MESSAGES`)) return
                      r.users.remove(message.author.id)
                   })
                   trash.on('collect', async () => {
                      m.delete()
                   })
              
                   stop.on('collect', async () => {
                     if(m.deleted !== false) return
                     else
                     if(message.guild.me.hasPermission(`MANAGE_MESSAGES`)) {
                     m.reactions.removeAll()}
                     trash.stop()
                     fore.stop()
                     back.stop()
                     stop.stop()
                   })
              
                   setTimeout(async () => {
                     if(m.deleted !== false) return
                     else
                     if(!message.guild.me.hasPermission(`MANAGE_MESSAGES`)) return
                     m.reactions.removeAll()
                   }, 60000);
              
              })}
              commandList(filenames) 
        } else {
    var tempbed = '*No Command Found*'
    var cmd = message.client.path.load.get(args.join(' ')) || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
    if(!cmd) return message.channel.send(tempbed)
    tempbed = new Discord.MessageEmbed()
    .setTitle(`**${cmd.name}** Information`)
    .setDescription(`**Details**: ${cmd.details}`)
    .setTimestamp()
    .setFooter(cmd.admin ? 'Admin Command' : 'Regular Command')
    if (typeof cmd.group !== 'undefined') {
        tempbed.addField('**Group**', cmd.group, true);
    }
    if (typeof cmd.aliases !== 'undefined') {
        tempbed.addField('**Aliases**', `\`${cmd.aliases.join('`, `')}\``, true);
    }
    if (typeof cmd.syntax !== 'undefined') {
        tempbed.addField('**Syntax**', `\`${cmd.syntax}\``, true);
    }
    if (typeof cmd.cooldown !== 'undefined') {
        tempbed.addField('**Cooldown**', cooldown(cmd), true);
    }
    if (typeof cmd.nsfw !== 'undefined') {
        tempbed.addField('**NSFW?**', cmd.nsfw == false ? '*Use Outside of NSFW Channels*' : cmd.nsfw == true ? '*Use Inside NSFW Channels*' : '*N/A*', true);
    }
    if (typeof cmd.reqArgs !== 'undefined') {
        tempbed.addField('**Args Required**', cmd.reqArgs ? 'Yes' : 'No', true);
    }
    if (typeof cmd.channelOnly !== 'undefined') {
        tempbed.addField('**Usable Channel Types**', `${channelize(cmd)}`, true);
    }
    if (typeof cmd.requires !== 'undefined') {
        tempbed.addField('**Permissions**', `${cmd.requires.join('`, ').slice(0, 128)}`, true);
    }
    if (typeof cmd.userRequires !== 'undefined') {
        tempbed.addField('**User Permissions**', `${cmd.userRequires.join('`, ').slice(0, 128)}`, true);
    }
    if (typeof cmd.private !== 'undefined') {
        tempbed.addField('**Private**', cmd.private ? 'Yes' : 'No', true);
    }
    if (typeof cmd.fallback !== 'undefined') {
        tempbed.addField('**Fallback**', cmd.fallback ? 'Yes' : 'No', true);
    }
    if (typeof cmd.ownerOnly !== 'undefined') {
        tempbed.addField('**Owner Only**', cmd.ownerOnly ? 'Yes' : 'No', true);
    }
    tempbed.addField(`**Directory: group/file.js**`, message.client.path.filename.get(cmd.name.toLowerCase()).split(`./src/${srcDirname}/commands/`).join(``), true);
    message.channel.send(tempbed)
    }}
}
module.exports = help;