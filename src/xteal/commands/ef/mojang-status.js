var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const https = require('https');
class test extends Command {
    constructor(client) {
        super(client, {
            name: 'mojangstatus',
            cooldown: 5,
            group:'ef',
            description: 'Check Mojang\'s status.',
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        var time = Date.now();
        var check = https.get(`https://status.mojang.com/check`, {headers: {"User-Agent": `tts-bot-${Math.random().toString(2, 16).substr(0,2)}`}},
         r => {
            var data = '';
            r.on('data', (d) => {
                data+=d;
            })
            r.on('close', () => {
                try{
                    var statuses = JSON.parse(data);
                    function RYGEmotes(status) {
                        switch(status.toLowerCase()) {
                            case 'green':
                                return '🟢';
                            case 'yellow':
                                return '🟡';
                            case 'red':
                                return '🔴';
                            default:
                                return '❓';
                        }
                    }
                    statuses = statuses.map(d => `${RYGEmotes(Object.values(d)[0])} - **${Object.keys(d)}**`)
                    var statusEmbed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor('#960000')
                    .setTitle(`Statuses`)
                    .setDescription(statuses)
                    .setFooter(`Ping: ${Date.now() - time}ms`)
                    message.channel.send(statusEmbed);
                }catch{
                    message.channel.send(`Something went wrong.`)
                }
            })
        })
        check.on('error', () => {
            return message.channel.send('An \`HTTPS\` related error occurred. Check manually or retry: ' + `https://minecraft-statistic.net/en/player/${ign}.html`+ ' \`Failed @ Mojang Name Check\`');
        });
    }};
module.exports = test;