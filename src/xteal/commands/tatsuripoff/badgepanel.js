var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
class bm extends Command {
    constructor(client) {
        super(client, {
            name: 'badgemanager',
            cooldown: 5,
            group:'tatsumaki',
            channelOnly: ['guild'],
            syntax: `badgemanager <user> <emoji> <badge name>`,
            private: true,
            ownerOnly: true,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        if(!args.length) return message.channel.send(`📛 **|**You need to put args, see \`${this.syntax}\``)
        var user;
        try {if(guild){if(args[0]){var num=/\d+/i.exec(args[0]);if(Array.isArray(num)){var id=(await message.guild.members.fetch(num)).user;if(id){user=id};}var arg=(await message.guild.members.fetch({query:args[0],limit:1})).first().user;if(arg) {user=arg}}}}catch{};
        if(!user) return message.channel.send(`📛 **|**You didn't put a user! See \`${this.syntax}\``)
        if(user.bot) return message.channel.send(`🗃️ **|** Bots can't have profiles.`);
        let userScore = message.client.getInfo.get(user.id);
        if (!userScore) {
            userScore = {
                user: user.id,
                infotext: "I'm a person.",
                rep: 0,
                level: 1,
                xp: 0,
                badges: JSON.stringify([]),
            }
        }
        var emote = args.slice(1)[0];
        var name = args.slice(2).join(' ');
        var badges = JSON.parse(userScore.badges);
        badges.push([emote, name]);
        userScore.badges = JSON.stringify(badges);
        message.client.setInfo.run(userScore);
        message.channel.send('Badge given.')
    }};
module.exports = bm;