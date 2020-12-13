const sqlite = require(`better-sqlite3`);
const fs = require('fs');
const config = require('./../config.json');
const Discord = require('discord.js');
const Command = require('./Command');
/**
 * @param {Discord.Client} bot
 */
module.exports = bot => {

    require('./../events.js')(bot);
    require('./Mixin.js')(bot);
    console.log('---------Running Verify.js---------');
    console.log('Validating config');
    if(config.owners.length < 1) {
      for(var owner of config.owners) {
        if(bot.api.users(owner)) console.warn(`Owner ${owner} can't be found in the API.`);
      }
      console.warn(`Bot owner list has no owners, put user IDs in ./src/util/config.json`);
    } 
    if(Array.isArray(config.prefixes)) {
      if(!config.prefixes.length) throw new TypeError(`Bot cannot have no prefixes.`);
      if(config.prefixes.length > 6) throw new TypeError(`Bot cannot have more than 5 prefixes.`);
      for(var prefix of config.prefixes) {
        if(typeof prefix !== 'string') throw new TypeError(`Prefix "${prefix}" is not a string.`);
        if(!prefix.length) throw new TypeError(`Prefix cannot be blank.`);
        if(prefix.length > 20) throw new TypeError(`Prefix "${prefix}" is too long.`);
        if(/\s/g.test(prefix)) throw new TypeError(`Prefix "${prefix}" cannot have spaces.`)
      }
    } else throw new TypeError('Bot prefix list is missing.');

    console.log('Validating commands');
    if(bot.path && bot.path.load && bot.path.deleted && bot.path.filename) throw new Error('Client.path must not be in use by bot.')
      bot.path = {} 
      bot.path.util = {};
      bot.path.load = new Discord.Collection();
      bot.path.deleted = new Discord.Collection();
      bot.path.filename = new Discord.Collection();
    if(!config.srcDirname.length) throw new TypeError("srcDirname for config.json cannot be left blank.");
    if(config.srcDirname.toLowerCase() == 'util') throw new TypeError("srcDirname for config.json cannot be named util.");
    if(typeof config.doCooldowns !== 'boolean') throw new TypeError("doCooldowns for config.json needs to be a boolean.");
    if(typeof config.doOwnerCooldowns !== 'boolean') throw new TypeError("doOwnerCooldowns for config.json needs to be a boolean.");
    if(typeof config.doInBetweenCooldowns !== 'boolean') throw new TypeError("doInBetweenCooldowns for config.json needs to be a boolean.");
    if(typeof config.respondToBadCommands !== 'boolean') throw new TypeError("respondToBadCommands for config.json needs to be a boolean.");

    Command.globalReload(bot, 'util/essentials');
    Command.globalReload(bot, config.srcDirname);

    console.log('Validating SQLITE files');

if(!fs.existsSync(`./src/util/essentials/util-cache/GuildPrefix.sqlite`)) {
  fs.mkdirSync(`./src/util/essentials/util-cache`, {recursive: true})
  fs.createWriteStream(`./src/util/essentials/util-cache/GuildPrefix.sqlite`, {flags: 'a+'});
  console.debug('Created file GuildPrefix.sqlite');
};
if(!fs.existsSync(`./src/util/essentials/util-cache/Cooldowns.sqlite`)) {
  fs.mkdirSync(`./src/util/essentials/util-cache`, {recursive: true})
  fs.createWriteStream(`./src/util/essentials/util-cache/Cooldowns.sqlite`, {flags: 'a+'});
  console.debug('Created file Cooldowns.sqlite');
};
if(!fs.existsSync(`./src/util/essentials/util-cache/GuildCommands.sqlite`)) {
  fs.mkdirSync(`./src/util/essentials/util-cache`, {recursive: true})
  fs.createWriteStream(`./src/util/essentials/util-cache/GuildCommands.sqlite`, {flags: 'a+'});
  console.debug('Created file GuildCommands.sqlite');
};

var GuildPrefixSqlite = sqlite(`./src/util/essentials/util-cache/GuildPrefix.sqlite`);
var CooldownsSqlite = sqlite(`./src/util/essentials/util-cache/Cooldowns.sqlite`);
var GuildCommandsSqlite = sqlite(`./src/util/essentials/util-cache/GuildCommands.sqlite`);

    console.log('Preparing Cooldowns');

    var cooldownsqlitetable = CooldownsSqlite.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'cooldown';").get();
    if (!cooldownsqlitetable['count(*)']) {
        console.log('Creating Table for Cooldowns');
        CooldownsSqlite.prepare("CREATE TABLE cooldown (id TEXT PRIMARY KEY, user TEXT, command TEXT, timestamp INTEGER);").run();
        CooldownsSqlite.prepare("CREATE UNIQUE INDEX idx_cooldown_id ON cooldown (id);").run();
        CooldownsSqlite.pragma("synchronous = 1");
        CooldownsSqlite.pragma("journal_mode = wal");
    }
    bot.getCooldown = CooldownsSqlite.prepare("SELECT * FROM cooldown WHERE user = ? AND command = ?");
    bot.setCooldown = CooldownsSqlite.prepare("INSERT OR REPLACE INTO cooldown (id, user, command, timestamp) VALUES (@id, @user, @command, @timestamp);");

    console.log('Preparing Guild Prefix');

    var guildprefixsqlitedatatable = GuildPrefixSqlite.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildprefix';").get();
    if (!guildprefixsqlitedatatable['count(*)']) {
        console.log('Creating Table for Guild Prefixes');
        GuildPrefixSqlite.prepare("CREATE TABLE guildprefix (guild TEXT, prefix TEXT);").run();
        GuildPrefixSqlite.prepare("CREATE UNIQUE INDEX idx_guildprefix_guild ON guildprefix (guild);").run();
        GuildPrefixSqlite.pragma("synchronous = 1");
        GuildPrefixSqlite.pragma("journal_mode = wal");
    }
    bot.getGuildPrefix = GuildPrefixSqlite.prepare("SELECT * FROM guildprefix WHERE guild = ?");
    bot.setGuildPrefix = GuildPrefixSqlite.prepare("INSERT OR REPLACE INTO guildprefix (guild, prefix) VALUES (@guild, @prefix);");
    bot.deleteGuildPrefix = GuildPrefixSqlite.prepare("DELETE FROM guildprefix WHERE guild = ?")

    console.log('Preparing Guild Commands');

    var guildcommandssqlitedatatable = GuildCommandsSqlite.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildcommands';").get();
    if (!guildcommandssqlitedatatable['count(*)']) {
      console.log('Creating Table for Guild Commands');
        GuildCommandsSqlite.prepare("CREATE TABLE guildcommands (id TEXT, guild TEXT, command TEXT, disabled INTEGER, user TEXT);").run();
        GuildCommandsSqlite.prepare("CREATE UNIQUE INDEX idx_guildcommands_id ON guildcommands (id);").run();
        GuildCommandsSqlite.pragma("synchronous = 1");
        GuildCommandsSqlite.pragma("journal_mode = wal");
    }
    bot.getGuildCommand = GuildCommandsSqlite.prepare("SELECT * FROM guildcommands WHERE guild = ? AND command = ?");
    bot.setGuildCommand = GuildCommandsSqlite.prepare("INSERT OR REPLACE INTO guildcommands (id, guild, command, disabled, user) VALUES (@id, @guild, @command, @disabled, @user);");

    if(config.doInBetweenCooldowns) {
      console.log('Preparing Global Cooldowns');
      bot.path.util.inBetweenCooldowns = new Discord.Collection();
    }

    console.log('Pending Ready Event')
    console.log(`---------Finished Verify.js---------`);
  bot.on('ready', () => {
    console.log(`---------Running Verify.js (Ready Event)---------`);
    console.log(`${bot.user.username} is online.`);
    config.doSqliteManagement ? require('./../events/sqliteManager.js')() : console.log('SQLITE3 Management is turned off');
    console.log(`Invite Link: https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8 (! Has Administrator Permissions !)`);
    console.log(`---------Finished Verify.js (Ready Event)---------`);
  })

}