var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
var Util = require('../../../util/essentials/Util.js');
class rank extends Command {
    constructor(client) {
        super(client, {
            name: 'rank',
            cooldown: 5,
            group:'tatsumaki',
            channelOnly: ['guild'],
            syntax: `rank <user>`,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        var user = await Util.userParsePlus(message, args, 'user');
        user = user || message.author;
        if(!user) return message.channel.send(`🗃️ **|** You didn't put a user! See \`${this.syntax}\``)
        if(user.bot) return message.channel.send(`🗃️ **|** Bots can't have ranks.`);
        let profile = message.client.getInfo.get(user.id);
        let coins = message.client.getCoin.get(user.id);
        if (!coins) {
            coins = {
              user: user.id,
              amount: 0,
              dailyLimitStart: 0,
              streak: 0,
              streaks: 0,   
            }
            message.client.setCoin.run(coins);
        }
        if (!profile) {
            profile = {
                user: user.id,
                infotext: "I'm a person.",
                rep: 0,
                level: 1,
                xp: 0,
                badges: JSON.stringify([]),
            }
            message.client.setInfo.run(profile);
        }
        var memberIds = (await message.guild.members.fetch()).filter(m => m.user.bot === false).map(m => m.id);
        var userBoard = message.client.getTopInfo.all(memberIds.join(','))
        var coinBoard = message.client.getTopCoin.all(memberIds.join(','))
        var userGlobal = message.client.getTopInfo.all(memberIds.join(','))
        var coinGlobal = message.client.getTopCoin.all(memberIds.join(','))
        userBoard = userBoard ? userBoard.find(o => o.user === user.id).rank : 0;
        coinBoard = coinBoard ? coinBoard.find(o => o.user === user.id).rank : 0;
        userGlobal = userGlobal ? userGlobal.find(o => o.user === user.id).rank : 0;
        coinGlobal = coinGlobal ? coinGlobal.find(o => o.user === user.id).rank : 0;
        var p = Math.floor((0.3 * Math.sqrt(profile.xp) / profile.level) * 10) * 10;
        var prog = [];
        try{
        while(p > 0) {
         prog.push('🟩');
         p = p-10;
        }
        } finally {
          while(prog.length < 10) {
           prog.push('⬛'); 
          }
        }
        prog = prog.join('');

        var embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Ranking Info`)
        .setAuthor(`${user.tag} (${user.id})`, user.avatarURL())
        .setColor(`#41d094`)
.setDescription(
`**Levels**
Level **${profile.level}**
**#${userBoard}** Guild Rank
**#${userGlobal}** Global Rank

**Progress**
${profile.level + 1 < 100000 ? `${prog} to Level **${profile.level + 1}**` : `At Max Level!`}

**Coins**
**#${coinBoard}** Guild Rank
**#${coinGlobal}** Global Rank
`)
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())

        message.channel.send(embed)
    }};
module.exports = rank;