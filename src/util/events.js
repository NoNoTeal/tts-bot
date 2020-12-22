const reqEvent = (event) => require (`./events/${event}.js`)
/**
 * 
 * @param {Discord.Client} bot 
 */
module.exports = (bot) => {
    //bot stuff
    bot.on("ready", function() {reqEvent("ready")(bot)});
    bot.on("reconnecting", () => reqEvent("reconnecting"))
    bot.on("disconnect", () => reqEvent("disconnecting"))
    bot.on("warn", function(warn) {reqEvent("warn")(warn)})
    bot.on("error", function(err) {reqEvent("error")(err)})
    bot.on('message', function(msg) {const CommandMessage = require('./essentials/CommandMessage.js'); new CommandMessage(msg.client, msg)})
    bot.on('message', function(msg) {reqEvent("message")(msg)})
    bot.on('interactionCreate', function(i) {reqEvent("slash")(i)})
}
