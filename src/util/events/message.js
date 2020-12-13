const Discord = require('discord.js');
const {checkBot} = require('./../config.json');
const {check} = require('./../../xteal/cache/list.js');
/**
 * @param {Discord.Message} msg 
 */
module.exports = msg => {
    var msgembed = msg.embeds[0];
    checkBot.push(msg.client.user.id)
    if(checkBot.includes(msg.author.id)) {
    if(msgembed && msgembed.author) {
    if(msgembed.author.name) {
        if(msgembed.author.name.endsWith(' joined the server for the first time')) {
        var ign = msgembed.author.name.split(' joined the server for the first time')[0];
        check(msg, ign)
    }}}}
};
