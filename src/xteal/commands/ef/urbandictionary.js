const querystring = require('querystring');
var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const { trim, generateColor } = require('../../../util/essentials/Util.js');
const fetch = require('node-fetch');
class ud extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            cooldown: 2,
            syntax: 'urban <term>',
            group:'ef',
            channelOnly: ['guild'],
            reqArgs: true,
            description: 'Search up a term on urban dictionary.',
            aliases: ['ud','urbandictionary']
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
      const query = querystring.stringify({ term: args.join(' ') });
      const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`, {headers:{'user-agent':'tts-bot' + Math.random().toString(2).substr(2, 16)}}).then(response => {return response.json().catch(() => {return []})}); 
      if (!list.length) {
        return message.channel.send(`No results found for **\`${trim(args.join(' '), 1000)}\`**.`);
      }
      const colors = generateColor('#1cd97d', `#5200ff`, 200);
      const answer = list[Math.floor(Math.random() * list.length)];
      const definition = answer.definition.replace(/\[([^\]]+)\]/gi, function(word) {
        word = word.substring(1, word.length-1);
        return `[**__${word}__**](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(word)})`;
      })
      const example = answer.example.replace(/\[([^\]]+)\]/gi, function(word) {
        word = word.substring(1, word.length-1);
        return `[**__${word}__**](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(word)})`;
      })
      const embed = new Discord.MessageEmbed()
	      .setColor(colors[Math.floor(Math.random() * colors.length)])
        .setTitle(answer.word)
        .setAuthor(answer.author ? `By ${answer.author}` : `By Anonymous`)
        .setURL(answer.permalink)
        .setDescription(`**Definition**\n${trim(definition, 2000)}`)
	      .addFields(
	      	{ name: 'Example', value: `${example.length ? trim(example, 1024) : `*No example provided.*`}` },
	      	{ name: 'Rating', value: answer.thumbs_up > answer.thumbs_down ? `**\`${answer.thumbs_up}\`** 👍 **|** **\`${answer.thumbs_down}\`** 👎` : `**\`${answer.thumbs_down}\`** 👎 **|** **\`${answer.thumbs_up}\`** 👍`}
        )
        .setFooter(`Published`)
        .setTimestamp(answer.written_on)

        if(answer.sound_urls.length) {
          embed.attachFiles(answer.sound_urls.slice(0,10))
        }

      message.channel.send(embed);
    }};
module.exports = ud;