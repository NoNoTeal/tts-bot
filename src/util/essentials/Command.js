const Discord = require('discord.js');
const PermissionFlags = Object.keys(Discord.Permissions.FLAGS);
const { owners, srcDirname, doCooldowns, doOwnerCooldowns, doInBetweenCooldowns } = require('./../config.json');
const fs = require('fs');
const Util = require('./Util');
class Command {
    /**
     * Client that this command was made under.
     * @typedef {Discord.Client} Client
     */

    /**
     * Channels this command is allowed in:
     * * guild
     * * direct
     * * text
     * * news
     * @typedef {'guild'|'direct'|'text'|'news'} channelType
     */

    /**
     * Permissions
     * @typedef {Discord.PermissionResolvable} PermissionType 
     */

    /**
     * @typedef {object} CommandInfo
     * @property {Discord.Client} _client Client that made the command (shortcut)
     * @property {string} name Name of the command
     * @property {string} group Group the command is in 
     * @property {string[]} aliases Names that link to this command
     * @property {string} syntax Syntax of the command
     * @property {number} cooldown Amount of seconds user needs to wait before executing command again
     * @property {boolean} nsfw If the command can only be used in nsfw channels or only outside of NSFW channels. `true` = only inside of NSFW channels, `false` = only outside of NSFW channels, `null` = can be used in either.
     * @property {boolean} reqArgs If the command requires arguments.
     * @property {channelType[]} channelOnly The types of channels this command can only be used in.
     * @property {string} description Short description of the command.
     * @property {string} details Long description of the command.
     * @property {PermissionType[]} requires Permissions the client requires. (Put "true" as the first item if the bot needs to have all permissions listed)
     * @property {PermissionType[]} userRequires Permissions the executor requires. (Put "true" as the first item if the user needs to have all permissions listed)
     * @property {boolean} private If the command is hidden from the help command,
     * @property {boolean} admin If the command cannot be disabled.
     * @property {boolean} fallback If the command is executed if a unknown command is sent,
     * @property {boolean} ownerOnly If the command can only be used by the bot owners in the botconfig.
     */

    /**
     * Constructor Information
     * @param {Client} client The client that instantiated this. (shortcut)
     * @param {CommandInfo} info Command info.
     */
    constructor(client, info) {
      this.constructor.validateCMD(client, info);
      /**
       * The client that instantiated this (shortcut)
       * @name Discord.Client
       * @type {Discord.Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });

   /**
	* The client that instantiated this. (shortcut)
    * @type {Discord.Client}
    * @private
    */
    this._client = client;

   /**
    * Name of command
    * @type {string}
    * @example helloworld
    */
   this.name = info.name;

   /**
    * Group the command is in
    * @type {string}
    * @example Test Group
    */
   this.group = info.group || 'None';

   /**
    * Aliases associated to the command
    * @type {?string[]}
    * @example ['hw', 'hiworld']
    */
   this.aliases = info.aliases;

   /**
    * Syntax of command
    * @type {?string}
    * @example helloworld
    */
   this.syntax = typeof info.syntax === 'string' && info.syntax.length ? info.syntax : 'No Syntax Provided';

   /**
    * Command's cooldown (in seconds, not milliseconds)
    * @type {number}
    * @example 5
    */
   this.cooldown = info.cooldown;

   /**
    * If the command should be used only inside or only outside of NSFW channels.
    * @type {boolean} True = Only in NSFW channels, False = Only outside of NSFW Channels. Null = Can be used in either.
    * @example false
    */
   this.nsfw = typeof info.nsfw === 'boolean' ? info.nsfw : null;

   /**
    * If the command always needs arguments
    * @type {boolean} 
    * @example false
    */
   this.reqArgs = info.reqArgs;

   /**
    * Supply a type of channel this can only be used in. Do not mistake this for a boolean, this is a array.
    * @type {?channelType[]}
    * @example ['guild', 'direct', 'text', 'news']
    */
   this.channelOnly = info.channelOnly;

   /**
    * A short description of the command
    * @type {string}
    * @example Prints "Hello world" in your console!
    */
   this.description = typeof info.description === 'string' ? info.description.length ? info.description.length < 100 ? info.description : '*No Description Provided*' : '*No Description Provided*' : '*No Description Provided*'

   /**
    * A long description of the command
    * @type {?string}
    */
   this.details = typeof info.details === 'string' ? info.details.length ? info.details.length < 100 ? info.details : '*No Details Provided*' : '*No Details Provided*' : '*No Details Provided*'

   /**
    * Permissions the bot needs in order to run
    * @type {?PermissionType[]}
    * @example ['SEND_MESSAGES'] (although bot checks beforehand if it can send messages, etc.)
    */
   this.requires = info.requires;

   /**
    * Permissions the user needs in order to run this command
    * @type {?PermissionType[]}
    * @example ['VIEW_CHANNEL'] (although bot checks beforehand if it can send messages, etc.)
    */
   this.userRequires = info.userRequires;

   /**
    * If command cannot be discovered from the help menu
    * @type {boolean}
    * @example false
    */
   this.private = info.private;

   /**
    * If this command is ranked admin (it cannot be unloaded or loaded.)
    * @type {boolean}
    * @example false
    */
   this.admin = info.admin;

   /**
    * If this command is a fallback command when a user executes a command that the bot doesn't have. Setting multiple fallback commands is possible but isn't recommended.
    * @type {boolean}
    * @example false
    */
   this.fallback = info.fallback;

   /**
    * If only the bot owners in the config can use this.
    * @type {boolean}
    * @example true
    */
   this.ownerOnly = info.ownerOnly;
	}

   /**
    * Runs the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    * @param {Discord.Guild} guild 
    */
    async run(message, args, guild) { // eslint-disable-line no-unused-vars, require-await
        message.channel.send(`Bot Error: \`${this.name}\` does not have a \`async run()\` method. Please let a bot owner fix this.`);
		throw new Error(`Command \`${this.name}\` doesn't have a run() method.`);
    }

   /**
    * Stops the command with a reason.
	* @param {Discord.Message} msg
    * @param {string} reason 
    * @param {object | string | boolean | number} response
    * @param {Command} info 
    * @returns {void}
    * @static
    * @private
    */
    static stop(msg, reason, response, info) {
      let c = []
        switch(reason) {
            case 'nsfw':
                Util.automsg(`Please use the \`${info.name}\` command ${response ? 'inside' : 'outside'} a \`NSFW\` channel.`, msg, 10);
            return;
            case 'reqArgs':
                Util.automsg(`This command requires args. Syntax: \`${info.syntax}\``, msg, 10);
            return;
            case 'channelOnly':
                for(var r of response) {
                    if(!['guild','direct','text','news'].includes(r.toLowerCase())) continue;
                    switch(r) {
                        case 'guild':
                            if(c.includes('Guild')) break;
                            c.push('Guild')
                        break;
                        case 'text':
                            if(c.includes('Text')) break;
                            c.push('Text')
                        break;
                        case 'direct':
                            if(c.includes('Direct Message')) break;
                            c.push('Direct Message')
                        break;
                        case 'news':
                            if(c.includes('News')) break;
                            c.push('News')
                        break;
                    }
                }
                Util.automsg(`Please use the \`${info.name}\` command in a \`${c.join('`, `')}\` channel.`, msg, 10);
            return;
            case 'requires':
                Util.automsg(`To use the \`${info.name}\` command, this bot needs more permissions to do this! ***Needs ${response[0] ? 'all' : 'some'} of the permissions: \`${response[1].join(', ').slice(0, 1500)}\`***`, msg, 20);
            return;
            case 'userRequires':
                Util.automsg(`To use the \`${info.name}\` command, you need more permissions to do this! ***Needs ${response[0] ? 'all' : 'some'} of the permissions: \`${response[1].join(', ').slice(0, 1500)}\`***`, msg, 20);
            return;
            case 'admin':
                Util.automsg(`The \`${info.name}\` command cannot be disabled.`, msg, 10);
            return;
            case 'ownerOnly':
                Util.automsg(`The \`${info.name}\` command is for bot owner use only.`, msg, 10);
			return;
			case 'cooldown':
				Util.automsg(`Please wait ${response} before running the \`${info.name}\` command again.`, msg, 10);
            return;
            case 'globalCooldown':
				Util.automsg(`Please wait a moment before running another command again.`, msg, 10);
            return;
            case 'guildDisabled':
                Util.automsg(`The \`${info.name}\` command is currently disabled in this guild by \`${response}\`.`, msg, 10);
            return;
            case 'custom':
                Util.automsg(`${info[0]}`, msg, info[1]);
            return;
        };
    };

    /**
     * Unloads command
     * @param {Discord.Message} msg
     * @param {Command} command
     * @param {Boolean} silent
     * @static
     */
    static unload(msg, command, silent) {
        var client = msg.client;
        if(command.prototype instanceof Command) {
        command = new command(msg.client);
        if(command.admin) return Util.silentMessage(msg, 'Provided command cannot be unloaded.', silent);
        try{
        delete require.cache[require.resolve(client.path.filename.get(command.name.toLowerCase()).replace('src', '../..'))];
        client.path.deleted.set(command.name.toLowerCase(), client.path.load.get(command.name.toLowerCase()));
        client.path.load.delete(command.name.toLowerCase());
        return Util.silentMessage(msg, `Command \`${command.name}\` was unloaded.`, silent);
        } catch (e) {console.error(e); Util.silentMessage(msg, `An error has occurred. Check \`console\` for details.`, silent);}
        } else return Util.silentMessage(msg, 'Provided command is not a command.', silent);
    };

    /**
     * Unloads a whole group, calls unload() function.
     * @param {Discord.Message} msg 
     * @param {Boolean} everything
     * @param {String} group 
     */
    static unloadGroup(msg, everything, group) {
        var searchDir = `./src/${srcDirname}/commands/`;
        !everything ? searchDir+=`${group}/` : ``;
        if(!fs.existsSync(searchDir)) return msg.channel.send('Invalid Directory');

        var paths = !everything ? Util.getLayerOfFiles(searchDir, null, '.js') : Util.getAllFiles(searchDir, null, '.js');
        for(var path of paths) {
            var cmd = require(`${path.replace('src', '../..')}`);
            if(cmd.prototype instanceof Command) {
                var cmdInfo = new cmd(msg.client);
                if(!msg.client.path.filename.get(cmdInfo.name.toLowerCase())) msg.client.path.filename.set(cmdInfo.name.toLowerCase(), path)
                Command.unload(msg, cmd, true);
            } else continue;
        };
        msg.channel.send(`Unloaded ${everything ? 'everything' : `group: \`${group}\``}`);
    };

    /**
     * Loads command
     * @param {Discord.Message} msg
     * @param {Command} command
     * @param {Boolean} silent
     * @static
     */
    static load(msg, command, silent) {
        var client = msg.client;
        if(command.prototype instanceof Command) {
        command = new command(client);
        if(command.admin) return Util.silentMessage(msg, 'Provided command cannot be loaded.', silent);
        try{
        client.path.load.set(command.name.toLowerCase(), client.path.deleted.get(command.name.toLowerCase()));
        client.path.deleted.delete(command.name.toLowerCase());
        return Util.silentMessage(msg, `Command \`${command.name}\` was loaded.`, silent);
        } catch (e) {console.error(e); Util.silentMessage(msg, `An error has occurred. Check \`console\` for details.`, silent);}
        } else return Util.silentMessage(msg, 'Provided command is not a command.', silent);
    };

    /**
     * Loads a whole group, calls load() function.
     * @param {Discord.Message} msg 
     * @param {Boolean} everything
     * @param {String} group 
     */
    static loadGroup(msg, everything, group) {
        var searchDir = `./src/${srcDirname}/commands/`;
        !everything ? searchDir+=`${group}/` : ``;;
        if(!fs.existsSync(searchDir)) return msg.channel.send('Invalid Directory');

        var paths = !everything ? Util.getLayerOfFiles(searchDir, null, '.js') : Util.getAllFiles(searchDir, null, '.js');
        for(var path of paths) {
            var cmd = require(`${path.replace('src', '../..')}`);
            if(cmd.prototype instanceof Command) {
                var cmdInfo = new cmd(msg.client);
                if(!msg.client.path.filename.get(cmdInfo.name.toLowerCase())) msg.client.path.filename.set(cmdInfo.name.toLowerCase(), path)
                Command.load(msg, cmd, true);
            } else continue;
        };
        msg.channel.send(`Loaded ${everything ? 'everything' : `group: \`${group}\``}`);
    };

    /**
     * Reloads command
     * @param {Discord.Message} msg
     * @param {Command} command
     * @param {Boolean} silent
     * @static
     */
    static reload(msg, command, silent) {
        var client = msg.client;
        if(command.prototype instanceof Command) {
        command = new command(msg.client);
        if(command.admin) return Util.silentMessage(msg, 'Provided command cannot be reloaded.', silent);
        try{
        var path = client.path.filename.get(command.name.toLowerCase()).replace('src', '../..');
        delete require.cache[require.resolve(path)];
        client.path.deleted.set(command.name.toLowerCase(), command);
        client.path.load.delete(command.name.toLowerCase());
        command = require(path);
        if(command.prototype instanceof Command) {
            command = new command(client);
            client.path.load.set(command.name.toLowerCase(), command);
            client.path.deleted.delete(command.name.toLowerCase());
            return Util.silentMessage(msg, `Command \`${command.name}\` was reloaded.`, silent);
        } else return Util.silentMessage(msg, 'Command cache was deleted but new "command" is not a command.', silent);
        } catch (e) {console.error(e); Util.silentMessage(msg, `An error has occurred. Check \`console\` for details.`, silent)}
    }};

    /**
     * Reloads a whole group, calls reload() function.
     * @param {Discord.Message} msg 
     * @param {Boolean} everything
     * @param {String} group 
     */
    static reloadGroup(msg, everything, group) {
        var searchDir = `./src/${srcDirname}/commands/`;
        !everything ? searchDir+=`${group}/` : ``;
        if(!fs.existsSync(searchDir)) return msg.channel.send('Invalid Directory');

        var paths = !everything ? Util.getLayerOfFiles(searchDir, null, '.js') : Util.getAllFiles(searchDir, null, '.js');
        for(var path of paths) {
            var cmd = require(`${path.replace('src', '../..')}`);
            
            if(cmd.prototype instanceof Command) {
            var cmdInfo = new cmd(msg.client);
            if(!msg.client.path.filename.get(cmdInfo.name.toLowerCase())) msg.client.path.filename.set(cmdInfo.name.toLowerCase(), path)
            Command.reload(msg, cmd, true);
            } else continue;
        };
        msg.channel.send(`Reloaded ${everything ? 'everything' : `group: \`${group}\``}`);
    };
    
    /**
     * Loads command in a guild
     * @param {Discord.Message} msg
     * @param {Command} command
     * @param {Boolean} silent
     * @returns {?Discord.Message} Discord Message
     */
    static guildLoad(msg, command, silent) {
        if(msg.guild) {
        if(command.admin) return Util.silentMessage(msg, `\`${command.name}\` is an essential command and cannot be guild loaded.`, silent, [true, 10]);
        var getter = msg.client.getGuildCommand.get(msg.guild.id, command.name.toLowerCase())
        if(!msg.member.hasPermission('MANAGE_MESSAGES') || !msg.member.hasPermission('BAN_MEMBERS') || !msg.member.hasPermission('MANAGE_GUILD')) return Util.silentMessage(msg, `You cannot enable commands in this guild. Needs \`MANAGE_MESSAGES\`, \`BAN_MEMBERS\`, \`MANAGE_GUILD\`.`, silent, [true, 10]);
        if(!getter) return Util.silentMessage(msg, `The \`${command.name}\` command is already enabled in this guild by default.`, silent, [true, 10]);
        if(getter.disabled == 0) return Util.silentMessage(msg, `The \`${command.name}\` command is already enabled in this guild by ${getter.user}.`, silent, [true, 10]);
        msg.client.setGuildCommand.run({id: `${msg.guild.id}-${command.name.toLowerCase()}`, guild: msg.guild.id, command: command.name.toLowerCase(), disabled: 0, user: `${msg.author.tag} (${msg.author.id})`});
        Util.silentMessage(msg, `The \`${command.name}\` command was guild unloaded.`, silent);
        } else return Util.silentMessage(msg, `This command is for **guilds only**.`, silent);
    };
    
    /**
     * @param {Discord.Message} msg 
     * @param {Boolean} everything
     * @param {String} group 
     */
    static guildLoadGroup(msg, everything, group) {
        var searchDir = `./src/${srcDirname}/commands/`;
        !everything ? searchDir+=`${group}/` : ``;
        if(!fs.existsSync(searchDir)) return msg.channel.send('Invalid Directory');

        var paths = !everything ? Util.getLayerOfFiles(searchDir, null, '.js') : Util.getAllFiles(searchDir, null, '.js');
        for(var path of paths) {
            var cmd = require(`${path.replace('src', '../..')}`);
            if(cmd.prototype instanceof Command) {
            cmd = new cmd(msg.client)
            if(!msg.client.path.filename.get(cmd.name.toLowerCase())) msg.client.path.filename.set(cmd.name.toLowerCase(), path)
            Command.guildLoad(msg, cmd, true);
            } else continue;
        };
        msg.channel.send(`Guild loaded ${everything ? 'everything' : `group: \`${group}\``}`);
    };

    /**
     * Unloads command in a guild
     * @param {Discord.Message} msg
     * @param {Command} command
     * @param {Boolean} silent
     * @returns {?Discord.Message} Discord Message
     */
    static guildUnload(msg, command, silent) {
        if(msg.guild) {
        if(command.admin) return Util.silentMessage(msg, `\`${command.name}\` is an essential command and cannot be guild unloaded.`, silent, [true, 10]);
        var getter = msg.client.getGuildCommand.get(msg.guild.id, command.name.toLowerCase());
        if(!msg.member.hasPermission('MANAGE_MESSAGES') || !msg.member.hasPermission('BAN_MEMBERS') || !msg.member.hasPermission('MANAGE_GUILD')) return Util.silentMessage(msg, `You cannot disable commands in this guild. Needs \`MANAGE_MESSAGES\`, \`BAN_MEMBERS\`, \`MANAGE_GUILD\`.`, silent, [true, 10]);
        if(getter) {
        if(getter.disabled == 1) return Util.silentMessage(msg, `The \`${command.name}\` command is already disabled in this guild by ${getter.user}.`, silent, [true, 10]);
        }
        msg.client.setGuildCommand.run({id: `${msg.guild.id}-${command.name.toLowerCase()}`, guild: msg.guild.id, command: command.name.toLowerCase(), disabled: 1, user: `${msg.author.tag} (${msg.author.id})`});
        Util.silentMessage(msg, `The \`${command.name}\` command was guild unloaded.`, silent);
        } else return Util.silentMessage(msg, `This command is for **guilds only**.`, silent);
    };
        
    /**
     * @param {Discord.Message} msg 
     * @param {Boolean} everything
     * @param {String} group 
     */
    static guildUnloadGroup(msg, everything, group) {
        var searchDir = `./src/${srcDirname}/commands/`;
        !everything ? searchDir+=`${group}/` : ``;
        if(!fs.existsSync(searchDir)) return msg.channel.send('Invalid Directory');

        var paths = !everything ? Util.getLayerOfFiles(searchDir, null, '.js') : Util.getAllFiles(searchDir, null, '.js');
        for(var path of paths) {
            var cmd = require(`${path.replace('src', '../..')}`);
            if(cmd.prototype instanceof Command) {
            cmd = new cmd(msg.client);
            if(!msg.client.path.filename.get(cmd.name.toLowerCase())) msg.client.path.filename.set(cmd.name.toLowerCase(), path)
            Command.guildUnload(msg, cmd, true);
            } else continue;
        };
        msg.channel.send(`Guild unloaded ${everything ? 'everything' : `group: \`${group}\``}`);
    };

	/**
	 * Checks if the command is executable.
	 * @param {Discord.Message} msg 
	 * @returns {Discord.Message || boolean}
	 */
	executable(msg) {
        if(msg.guild) {
            if(this._client.getGuildCommand.get(msg.guild.id, this.name.toLowerCase())) {
            if(this._client.getGuildCommand.get(msg.guild.id, this.name.toLowerCase()).disabled == 1) return this.constructor.stop(msg, 'guildDisabled', this._client.getGuildCommand.get(msg.guild.id, this.name.toLowerCase()).user, this);
            };
        };
        if(doCooldowns || doOwnerCooldowns || doInBetweenCooldowns) {
            if(!doOwnerCooldowns && owners.includes(msg.author.id));
            else {
            if(typeof this.cooldown === 'number') {
            if(this._client.getCooldown.get(msg.author.id, this.name.toLowerCase())) {
            if(this._client.getCooldown.get(msg.author.id, this.name.toLowerCase()).timestamp > Date.now() - this.cooldown * 1000) {
            let ts = (this._client.getCooldown.get(msg.author.id, this.name.toLowerCase()).timestamp - (Date.now() - this.cooldown * 1000)),
                years = Math.trunc(ts / 1000 / 60 / 60 / 24 / 365) % 365,
                weeks = Math.trunc(ts / 1000 / 60 / 60 / 24 / 7) % 7,
                days = Math.trunc(ts / 1000 / 60 / 60 / 24) % 24,
                hours = Math.trunc(ts / 1000 / 60 / 60) % 60,
                minutes = Math.trunc(ts / 1000 / 60) % 60,
                seconds = Math.trunc(ts / 1000 ) % 60,
                times = [
                `${years <= 0 ? `` : `\`${years}\` **year${years > 1 ? 's' : ''}**`}`,
                `${weeks <= 0 ? `` : `\`${weeks}\` **week${weeks > 1 ? 's' : ''}**`}`,
                `${days <= 0 ? `` : `\`${days}\` **day${days > 1 ? 's' : ''}**`}`,
                `${hours <= 0 ? `` : `\`${hours}\` **hour${hours > 1 ? 's' : ''}**`}`,
                `${minutes <= 0 ? `` : `\`${minutes}\` **minute${minutes > 1 ? 's' : ''}**`}`,
                `${seconds <= 0 ? `` : `\`${seconds}\` **second${seconds > 1 ? 's' : ''}**`}`,
            ].filter(i => i.length).join(', ');
            times = times.length ? times : `a moment`;
            return this.constructor.stop(msg, 'cooldown', `${times}`, this)}}};
            if(doInBetweenCooldowns && this._client.path.util.inBetweenCooldowns instanceof Discord.Collection) {
                if(this._client.path.util.inBetweenCooldowns.get(msg.author.id) > Date.now() - 1000) return this.constructor.stop(msg, 'globalCooldown');
                else this._client.path.util.inBetweenCooldowns.set(msg.author.id, Date.now());
            }}
        }
        if(this.ownerOnly === true) {
			if(!owners.includes(msg.author.id)) return this.constructor.stop(msg, 'ownerOnly', null, this)
		}
        if(msg.guild) {
            if(!msg.guild.me.hasPermission('SEND_MESSAGES') || 
            !msg.guild.me.hasPermission('READ_MESSAGE_HISTORY') || 
            !msg.guild.me.hasPermission('VIEW_CHANNEL') ||
            !msg.guild.me.hasPermission('ATTACH_FILES') || 
            !msg.guild.me.hasPermission('EMBED_LINKS')) return

            if(Array.isArray(this.requires)) {
                var needs = this.requires;
                var per = [];
                  if(needs[0] == true) {
                    for(var n of needs) {
                        if(!PermissionFlags.includes(n)) continue;
                        if(per.includes(n)) continue;
                        per.push(n);
                    }
                    if(!per.every(p => msg.guild.me.hasPermission(p))) return this.constructor.stop(msg, 'requires', [true, per], this);
                  } else {
                      for(var n of needs) {
                          if(!PermissionFlags.includes(n)) continue;
                          if(per.includes(n)) continue;
                          per.push(n);
                      }
                    if(!per.some(p => msg.guild.me.hasPermission(p))) return this.constructor.stop(msg, 'requires', [false, per], this);
                  }
            }
            if(Array.isArray(this.userRequires)) {
                var permissions = this.userRequires;
                var per = [];
                if(permissions[0] == true) {
                    for(var p of permissions) {
                        if(!PermissionFlags.includes(p)) continue;
                        if(per.includes(p)) continue;
                        per.push(p);
                    }
                    if(!per.every(p => msg.member.hasPermission(p))) return this.constructor.stop(msg, 'userRequires', [true, per], this);
                } else {
                    for(var p of permissions) {
                        if(!PermissionFlags.includes(p)) continue;
                        if(per.includes(p)) continue;
                        per.push(p);
                    }
                    if(!per.some(p => msg.member.hasPermission(p))) return this.constructor.stop(msg, 'userRequires', [false, per], this);
                }
            }
        }
        if(Array.isArray(this.channelOnly)) {
            let verifiedchannels = false;
            let channels = [];
            for(var channel of this.channelOnly) {
                if(!['guild','direct','text','news'].includes(channel.toLowerCase())) continue;
                if(channels.includes(channel.toLowerCase())) continue;
                switch(channel.toLowerCase()) {
                    case 'guild':
                        if(msg.channel instanceof Discord.GuildChannel) verifiedchannels = true;
                    break;
                    case 'direct':
                        if(msg.channel instanceof Discord.DMChannel) verifiedchannels = true;
                    break;
                    case 'text':
                        if(msg.channel instanceof Discord.TextChannel) verifiedchannels = true;
                    break;
                    case 'news':
                        if(msg.channel instanceof Discord.NewsChannel) verifiedchannels = true;
                    break;
                };
                channels.push(channel.toLowerCase())
            }

            if(verifiedchannels !== true) return this.constructor.stop(msg, 'channelOnly', channels, this)

        }
        if(this.nsfw !== null) {
            switch(this.nsfw) {
                case true:
                    if(!msg.channel.nsfw) return this.constructor.stop(msg, 'nsfw', this.nsfw, this);
                break;
                case false:
                    if(msg.channel.nsfw) return this.constructor.stop(msg, 'nsfw', this.nsfw, this);
                break;
            }
        }
        if(this.reqArgs) {
            var messageContent = msg.content.match(Util.generateRegex(msg)).groups;
            if(!messageContent.arguments) return this.constructor.stop(msg, 'reqArgs', null, this)
        }

        return 'finished';

    }

    /**
     * Runs a command
     * @param {Command} command
     * @param {Discord.Message} message
     * @param {String[]} args
     * @private
     * @static
     */
    static preRunner(command, message, args){    
        if(command instanceof Command) {
        if(command.executable(message) !== 'finished') return;
        command.throttle(message.author);
      try {
        command.run(message, args, message.guild);
      } catch (error) {
        console.error(error);
        message.react(`⚠️`);
    }} else return;};

    /**
     * Cooldown a user.
     * @param {Discord.User} author 
     * @param {Date} now 
     * @returns {void}
     * @private
     */
    throttle(author, now = Date.now()) {
        if(this._client.path.util.maintenance) return;
            if(typeof this.cooldown === "number") {
            var cd = this._client.getCooldown.get(author.id, this.name.toLowerCase());
            if(!cd) {
                cd = {
                    id: `${author.id}-${this.name.toLowerCase()}`,
                    user: author.id,
                    command: this.name.toLowerCase(),
                    timestamp: now
                };
            } else {
                cd.timestamp = now;
            };
            this._client.setCooldown.run(cd);
            };
            return;
    } 

    /**
     * Cancels a throttle, recommended for long throttles.
     * @param {Discord.User} author 
     */
    cancelThrottle(author) {
        this.throttle(author, 0);
    }

    /**
     * Fetches all commands and validates names.
     * @param {Discord.Client} bot 
     * @param {string} d folder name
     * @param {boolean} clearAll
     */
    static globalReload(bot, d, clearAll = false) {
    if(!fs.existsSync(`./src/${d}/commands`)) return;
    if(!fs.readdirSync(`./src/${d}/commands`)) return;
    if(clearAll) {
        bot.path = {} 
        bot.path.load = new Discord.Collection();
        bot.path.filename = new Discord.Collection();
    }
    function find(arr1, arr2) { 
        return arr1.some(r=> arr2.indexOf(r) >= 0);
    }
      var paths = Util.getAllFiles(`./src/${d}/commands`, null, '.js');
      var names = [];
      var aliases = [];
      for(var path of paths) {
        if(clearAll) {
        delete require.cache[require.resolve(path.replace('src', '../..'))];
        }
        var command = require(`${path.replace('src', '../..')}`);
        if(command.prototype instanceof Command) {
            command = new command(bot);
          bot.path.load.set(command.name.toLowerCase(), command);
          bot.path.filename.set(command.name.toLowerCase(), path)
          if(Array.isArray(command.aliases)) {
            command.aliases.forEach(a => {
                aliases.push(a.toLowerCase());
            });
          }
          names.push(command.name.toLowerCase());
        } else continue;
      };
      if(find(names, aliases)) throw new TypeError(`Command names or aliases cannot match each other.`);
      for(var name of names) {
        if(Util.countInArray(names, name) > 1) throw new TypeError(`Command name ${name} cannot be used more than once.`);
      };
    };

    /**
     * Ensures the command is ready to run and is up to standards before running it.
     * @param {Discord.Client} client 
     * @param {CommandInfo} info 
     * @returns {void}
     * @static
     * @private
     */
    static validateCMD(client, info) {
        function hasWhiteSpace(s) {
            return /\s/g.test(s);
        }
        if(!client) throw new Error('Client wasn\'t specified.');
        if(typeof info !== 'object') throw new TypeError('Cannot get command info. (Needs to be an object)');
        if(!info.name.length) throw new TypeError('Command name is missing.');
        if(typeof info.name !== 'string') throw new TypeError('Command name is not a string.');
        if(info.name.length > 1000) throw new RangeError('Command name is too long.');
        if(hasWhiteSpace(info.name)) throw new TypeError('Command name cannot have spaces.');

        if(info.group) {
        if(typeof info.group !== 'string') throw new TypeError(`Command(${info.name})'s group is not a string.`);
        if(info.group.length > 20) throw new TypeError(`Command(${info.name})'s group is too long.`);
        }

        if(info.aliases) {
        if(typeof info.aliases !== 'object') throw new TypeError(`Command(${info.name})'s aliases is not a array.`); 
        if(!Array.isArray(info.aliases)) throw new TypeError(`Command(${info.name})'s aliases is not an array.`);
        if(info.aliases.length > 20) throw new TypeError(`Command(${info.name})'s aliases cannot be greater than 20.`);
        if(!info.aliases.every(alias => alias.length < 1000)) throw new RangeError(`Command(${info.name})'s aliases cannot contain an alias greater than a length of 1000 characters.`);
        if(!info.aliases.every(alias => typeof alias == 'string')) throw new TypeError(`All of command(${info.name})'s aliases has to be a string.`);
        if(!info.aliases.every(alias => !hasWhiteSpace(alias))) throw new TypeError(`All of command(${info.name})'s aliases cannot have spaces.`);
        }

        if(info.syntax) {
        if(typeof info.syntax !== 'string') throw new TypeError(`Command(${info.name})'s syntax is not a string.`);
        if(info.syntax.length > 100) throw new TypeError(`Command(${info.name})'s syntax is too long.`);
        }

        if(info.cooldown) {
            if(typeof info.cooldown !== 'number') throw new RangeError(`Command(${info.name})'s cooldown is not a number.`);
            if(info.cooldown < 0) throw new RangeError(`Command(${info.name})'s cooldown is less than a positive integer.`);
            if(info.cooldown > Number.MAX_SAFE_INTEGER) throw new RangeError(`Command(${info.name})'s cooldown is greater than the safest integer.`);
        }
        if(!Util.isNull(info.nsfw)) {
            if(!Util.isBoolean(info.nsfw)) throw new TypeError(`Command(${info.name})'s option nsfw is not a boolean or null.`);
        }

        if(!Util.isNull(info.reqArgs)) {
            if(!Util.isBoolean(info.reqArgs)) throw new TypeError(`Command(${info.name})'s option reqArgs is not a boolean.`);
        }

        if(info.channelOnly) {
            if(!Array.isArray(info.channelOnly)) throw new TypeError(`Command(${info.name})'s channelOnly is not an array.`);
            if(!info.channelOnly.every(c => typeof c == 'string')) throw new TypeError(`All of command(${info.name})'s channelOnly types have to be a string.`);
            if(!info.channelOnly.every(c => ['guild','direct','text','news'].includes(c.toLowerCase()))) throw new TypeError(`Command(${info.name})'s channelOnly does not contain proper channel-types. Use: ` + ['guild','direct','text','news']);
            if(info.channelOnly.length > 4) throw new RangeError(`Command(${info.name})'s channelOnly is too long.`);
        }

        if(info.description) {
        if(typeof info.description !== 'string') throw new TypeError(`Command(${info.name})'s description is not a string.`);
        if(info.description.length > 128) throw new RangeError(`Command(${info.name})'s description is too long.`);
        }

        if(info.details) {
        if(typeof info.details !== 'string') throw new TypeError(`Command(${info.name})'s details is not a string.`);
        if(info.details.length > 1500) throw new RangeError(`Command(${info.name})'s details is too long.`);
        }

        if(info.requires) {
            if(!Array.isArray(info.requires)) throw new TypeError(`Command(${info.name})'s requires is not a array.`);
            if(info.requires.length > PermissionFlags.length + 1) throw new TypeError(`Command(${info.name})'s requires cannot be longer than the Permission Flags.`);
        }

        if(info.userRequires) {
            if(!Array.isArray(info.userRequires)) throw new TypeError(`Command(${info.name})'s userRequires is not a array.`);
            if(info.userRequires.length > PermissionFlags.length + 1) throw new TypeError(`Command(${info.name})'s userRequires cannot be longer than the Permission Flags.`);
        }

        if(!Util.isNull(info.private)) {
            if(!Util.isBoolean(info.private)) throw new TypeError(`Command(${info.name})'s private is not a boolean.`);
        }
        
        if(!Util.isNull(info.admin)) {
            if(!Util.isBoolean(info.admin)) throw new TypeError(`Command(${info.name})'s admin is not a boolean.`);
        }
                
        if(!Util.isNull(info.fallback)) {
            if(!Util.isBoolean(info.fallback)) throw new TypeError(`Command(${info.name})'s fallback is not a boolean.`);
        }
                
        if(!Util.isNull(info.ownerOnly)) {
            if(!Util.isBoolean(info.ownerOnly)) throw new TypeError(`Command(${info.name})'s ownerOnly is not a boolean.`);
        }
    }

}

module.exports = Command;