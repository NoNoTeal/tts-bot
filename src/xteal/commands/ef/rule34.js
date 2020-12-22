const rule34Search = "https://rule34.xxx/index.php?page=dapi&json=1&s=post&q=index&limit=100";
const rule34Cdn = "https://img.rule34.xxx/images/"
var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');
class r34 extends Command {
    constructor(client) {
        super(client, {
            name: 'rule34',
            cooldown: 5,
            group:'ef',
            syntax: 'rule34 <term>',
            aliases: ['r34','porn'],
            description: 'Search up an inappropriate term, you fucking animal.',
            nsfw: true,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        const query = querystring.stringify({tags: args[0]});
        const list = await fetch(rule34Search + `&${query}`, {headers:{'user-agent':'tts-bot' + Math.random().toString(2).substr(2, 16)}}).then(response => {return response.json().catch(() => {return [];})});
        if(!list.length) return message.channel.send(`No results for this query`);
        const chosen = list[Math.floor(Math.random() * list.length)];
        const url = rule34Cdn + chosen.directory + '/' + chosen.image;
        const prnEmbed = new Discord.MessageEmbed()
        .setImage(url)
        .setAuthor(chosen.author ? chosen.author : 'Anonymous')
        .setFooter(`Score: ${chosen.score > 100 ? '100+' : chosen.score}`)
        .setTimestamp(Date.now() - chosen.change)
        .setColor('#ff3bcb');
        message.channel.send(prnEmbed);
    }};
module.exports = r34;