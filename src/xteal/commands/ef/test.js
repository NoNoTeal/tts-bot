var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
class test extends Command {
    constructor(client) {
        super(client, {
            name: 'xd',
            cooldown: 5,
            group:'ef',
            channelOnly: ['guild'],
            private: true,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        message.channel.send('ALCO不是中国人。')
    }};
module.exports = test;