var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
class setinfo extends Command {
    constructor(client) {
        super(client, {
            name: 'setinfo',
            cooldown: 5,
            group:'tatsumaki',
            channelOnly: ['guild'],
            syntax: `setinfo <bio>`,
            reqArgs: true,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async run(message, args) {
        let profile = message.client.getInfo.get(message.author.id);
        if (!profile) {
            profile = {
                user: message.author.id,
                infotext: "I'm a person.",
                rep: 0,
                level: 1,
                xp: 0,
                badges: JSON.stringify([]),
            }
        }
        profile.infotext = args.join(' ').length < 900 ? args.join(' ') : args.join(' ').slice(0, 900) + '...';
        message.client.setInfo.run(profile);
        message.channel.send(`Your bio is saved! Do \`profile\` to see it!`);
    }};
module.exports = setinfo;