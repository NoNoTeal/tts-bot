var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const Util = require('../../../util/essentials/Util.js');
const {owners} = require('./../../../util/config.json')
class pl extends Command {
    constructor(client) {
        super(client, {
            name: 'processlinks',
            cooldown: 2,
            syntax: 'processlinks <links[]>',
            group:'ef',
            channelOnly: ['guild'],
            reqArgs: true,
            description: 'Process links and turn it into data for the list file',
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async run(message, args) {
        args = args.filter(l => l.startsWith('https://minecraft-statistic.net/en/server/'))
        if(!args.length) return message.channel.send('Provide valid links. They must begin with \`https://minecraft-statistic.net/en/server/\`');
        if(args.length > 20) return message.channel.send('Only provide 20 links at once.');
            delete require.cache[require.resolve('./../../cache/servers.js')];
            const {blacklisted} = require('./../../cache/servers.js');
        var servers = [];
        var str = `{\n`;
        var madeServers = 0;
        var dupes = 0;
        var serverKeys = Object.values(blacklisted);
        var serverList = [].concat.apply([], serverKeys);
        function joinServers() {
            if(!servers.length) return message.channel.send('No data, try again?');
            for(var server of servers) {
                if(!serverList.includes(server._id)) {
                    str+= `"${server.info.name}":${server._id}, //${server.ip} | ${server.domain} | https://minecraft-statistic.net/api/server/info/${server._id}\n`.replace('discord', 'aids');
                    madeServers++;
                } else dupes++;
                if(dupes + madeServers == servers.length) {
                    if(madeServers == 0) return message.channel.send('No new servers found. All servers were already blacklisted.')
                    var embed = new Discord.MessageEmbed();
                    embed.setDescription(Util.trim(`\`\`\`json\n${str}}\n\`\`\``, 2048))
                    .setTimestamp()
                    .setTitle('Here is your server list.')
                    .setFooter(`${dupes}/${serverList.length} Duplicates found`)
                    if(owners.includes(message.author.id)) {
                        message.channel.send(embed)
                    } else {
                        message.channel.send('Links sent to owner...')
                        for(var u of owners) {
                        message.client.users.fetch(u).then(u => {
                        u.send('Submitted by ' + message.author, embed)
                    }).catch(e => {})}}
                }
            }
        }
        for(var link in args) {
            if(!args[link].startsWith('https://minecraft-statistic.net/en/server/')) continue;
            var serverLink = `https://minecraft-statistic.net/api/server/info/${args[link].split('https://minecraft-statistic.net/en/server/')[1].slice(0,-5)}`;
            const serverData = await fetch(serverLink, {headers:{'user-agent':'tts-bot' + Math.random().toString(2).substr(2, 16)}}).then(response => {return response.json().catch(() => {return {}})}); 
            if(serverData._id) {servers.push(serverData)};
            if(parseInt(link)+1 == args.length) {
                joinServers()
            }
            continue;
        }
    }
}
module.exports = pl;