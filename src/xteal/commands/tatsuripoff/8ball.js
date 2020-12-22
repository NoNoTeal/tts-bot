var Command = require('../../../util/essentials/Command');
var { MessageEmbed } = require('discord.js');
const responses = [
    "As I see it, yes.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don’t count on it.",
    "It is certain.",
    "It is decidedly so.",
    "Most likely.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Outlook good.",
    "Reply hazy, try again.",
    "Signs point to yes.",
    "Very doubtful.",
    "Without a doubt.",
    "Yes.",
    "Yes – definitely.",
    "You may rely on it."
];
class eightball extends Command
{
    constructor(client)
    {
            super(client,{
                name: "8ball",
                group: "tatsumaki",
                cooldown: 5,
                description: "Ask the 8ball your question and let the 8ball decide for you."
        });
    }

    async run(message, args)   {
        if(!args.length) return message.channel.send(`You need to ask the 8ball a question!`)
        var response = responses[Math.floor(Math.random() * responses.length)];
        var embed = new MessageEmbed()
        .setDescription(`🎱 **|** ${message.author}, ${response}`)
        .setColor(0x000fff)
        message.channel.send(embed);
    }
}

module.exports = eightball;