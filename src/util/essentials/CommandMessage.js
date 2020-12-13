const { prefixes, owners, respondToBadCommands } = require('./../config.json');
const Discord = require('discord.js');
const Command = require('./Command');
const Util = require('./Util');
class CommandMessage { 
      /**
     * Constructor Information
     * @param {Client} client The client that instantiated this. (shortcut)
     * @param {Discord.Message} message The message that triggered this
     */
    constructor(client, message) {
      var status = this.constructor.verify(client, message);
      if(status.toLowerCase() !== "ok") return console.log(status); 
      this.constructor.run(client, message)
      /**
       * The client that instantiated this (shortcut)
       * @name Discord.Client
       * @type {Discord.Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });
      Object.defineProperty(this, 'message', { value: message });

      /**
	     * The client that instantiated this. (shortcut)
       * @type {Discord.Client}
       */
      this._client = client;
      /**
       * Message that triggered this
       * @type {Discord.Message} 
       */
      this._message = message;
    }

    /**
     * Runs a command
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     */
    static run(client, message) {
      if(message.author.bot) return;
        if(client.path.util.maintenance) {
          if(!owners.includes(message.author.id)) return;
        }
        const regex = Util.generateRegex(message);
        const messageContent = message.content.match(regex);
        if(!messageContent) return;
        const args = messageContent.groups.arguments ? messageContent.groups.arguments.split(/\s+/) : [];
        const prefix = messageContent.groups.prefix.length ? messageContent.groups.prefix : prefixes[0];
        const command = client.path.load.get(messageContent.groups.command) || client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() == messageContent.groups.command));
        if (!command) {
        if(!client.path.load.array().some(c => c.fallback === true)) return respondToBadCommands ? Util.automsg(`That's not a command, see \`${prefix}help\`.`, message, 10) : undefined;
        for(var cmd of client.path.load.array()) {
          if(cmd.fallback !== true) continue;
          Command.preRunner(cmd, message, args);
        }} else {
          Command.preRunner(command, message, args)};
    }

    /**
     * Verifies supplied parameters are correct.
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @returns {String}
     */
    static verify(client, message) {
      if(client instanceof Discord.Client) {
        if(message instanceof Discord.Message) {
          return 'OK';
        } else return 'Message is not a D.JS Message.';
      } else return 'Client is not a D.JS Client.';
    }
};
module.exports = CommandMessage;