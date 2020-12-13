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
const fs = require('fs');
class evaluate extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            group: 'Util',
            syntax: 'eval <*>',
            cooldown: 5,
            description: 'Evals Javascript Code',
            details: 'Evaluate Javascript Code. Be careful with what you evaluate.',

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
        var args = message.content.split(/\s+/).slice(1).join(" ")
        if(!args.length) return message.channel.send(`Provide code`)
        var embed = new Discord.MessageEmbed()
        .setTitle(`Evaluated`)
        var client = message.client
        var bot = message.client
        var msg = message
        var channel = message.channel
        var guild = message.guild
        try {
            let evaled = eval(args);
            let hrStart = process.hrtime()
            let hrDiff;
            hrDiff = process.hrtime(hrStart)
            if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
            embed.setFooter(`Time: ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}s`)
            embed.setTimestamp()
            if(evaled.length > 2010) {
              embed.setDescription(`\`Input\` \`\`\`js
${args}\`\`\``)
fs.createWriteStream(`Eval.log`)
fs.writeFile("Eval.log", evaled,(err) => {
  if(err) console.log(err);
});


            } else {
            embed.setDescription(`OUTPUT \`\`\`xl
${evaled.length ? evaled : 'Nothing'}\`\`\``)
            }
            if(evaled.includes(client.token)) {
              embed.setDescription(`\`OUTPUT\` \`\`\`xl
TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgbXkgdG9rZW4=\`\`\``)
              return message.channel.send('', embed, {code :"xl"})
            }
            if(evaled.length > 2010) {
            embed.attachFiles(['Eval.log'])
            }
            await message.channel.send('', embed, {allowedMentions: { users: [], roles: [], parse: []}});
            if(fs.existsSync(`Eval.log`)) {
              fs.unlinkSync(`Eval.log`)
            }
          } catch (err) {
              embed.setDescription(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``)
              embed.setTimestamp()
            message.channel.send('', embed,{allowedMentions: { users: [], roles: [], parse: []}});
          }
    }
}
module.exports = evaluate;