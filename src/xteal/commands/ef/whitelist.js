const Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const {markers} = require('./../../../util/config.json');
const fs = require('fs');
class whitelist extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist',
            cooldown: 3,
            group:'ef',
            channelOnly: ['guild'],
            description: 'Mark person as a good person.',
            details: 'Make a person pass the background check automatically. Run this command on a whitelisted person to remove them.',
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async run(message, args) {
        if(!markers.includes(message.author.id)) return message.channel.send(`You are not authorized to modify the whitelist. Please request permission if you believe that you should have access.`)
        if(!args[0]) return message.channel.send('Name not found.')
        if(!args[0].split('').every(c=>/[A-z_0-9]+/.test(c))) return message.channel.send("Name doesn't comply with Mojang.")
        if(args[0].length > 16) return message.channel.send("Name is too long for Mojang.")
        var wl = require('./../../cache/whitelist.json');
        if(wl.includes(args[0].toLowerCase())) {
            wl.splice(wl.indexOf(args[0].toLowerCase()), 1);
            fs.writeFile('./src/xteal/cache/whitelist.json', JSON.stringify(wl, null, '\t'), 'utf8', (e) => {
                if(e) console.log(e);
            })
            message.channel.send(`Removed ${args[0]} from the whitelist.`);
        } else {
            wl.push(args[0].toLowerCase());
            fs.writeFile('./src/xteal/cache/whitelist.json', JSON.stringify(wl, null, '\t'), 'utf8', (e) => {
                if(e) console.log(e);
            })
            message.channel.send(`Added ${args[0]} to the whitelist.`);
        }
    }};
module.exports = whitelist;