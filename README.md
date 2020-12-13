# Commandno

Commandno is a crappy version of Discord.JS-Commando but simplified. This is a template for bots.

## TTS-bot

TTS-bot is a extension of Commandno with personalized Commands for Minecraft Discord Servers that apply to:

a) Has a server-chat channel, or Discord SRV
b) **Hates those goddamn players that come on trying to crash the server**

TTS-bot **warns** you of hazardous players, it doesn't ban. Discord SRV most likely ignores bots so it can't run commands through console-chat...

### What Comes with it?

- Tatsumaki ripoff
- Ability to check users
- Inappropriate shit I stripped from the bot before it hits Github
- Marking of hazardous players that come on

### Intents

- Members intent needed - Because Discord wants to fuck with members and profile + rank are broken without it.

#### Go more in-depth about the Check Users

Spams HTTPS requests and accepts only server IDs. Use the `processlinks` command to add more hazardous servers to the list, to put in `servers.js`. Based on the servers given, it will tell you if a player has visited said server. You can customize what servers you don't want.

## Bugs

Go to the issues tracker

## What comes with it?

- better-sqlite3 - Storing cooldowns, Guild Commands, and Guild Prefixes.
- Discord.JS v12.2.0 - Bot brains.
- node-gyp - better-sqlite3 helper.
- systeminformation - Helpful for `util`'s `info` command.

## Well, what does it do?

- Uses `client.path` in order to store commands, so don't let your code conflict with `client.path` or you've mcfucked your command structure.
- Is a simple wrapper for making commands.
- Comes with some starter utility commands.
- Comes with a Utility class for various tasks.
- Hourly SQLITE3 (Utility only) backups
- Minutely SQLITE3 Cooldown purges
- Mixins to inject in YOUR own code at startup!

## How to Make a command?

```js
var Command = require('../../../util/essentials/Command.js'); //require command to extend off of it.

class helloworld extends Command {
    constructor(client) {
        super(client, {
            name: 'helloworld', //jsdoc support will help you
        })
    }
    async run(message, args, guild) {
        message.channel.send('Hello World!')
    }
}
module.exports = helloworld;
```

## What Options a Command Has
Option | Required | Short Description | Parameters | Default
-|-|-|-|-
`name` | Yes | Names the command. | `string` | `*`
`group` | No | Shows what group the command is in. | `string` | `None`
`aliases` | No | Aliases that trigger this command. | `string array` | `null`
`syntax` | No | Shows how to use a command. | `string` | `No Syntax Provided`
`cooldown` | No | Ratelimit a command. | `number` | `0`
~~`guildCooldown`~~ | ~~No~~ | Ratelimit a command in a guild. (Planned feature?) | ~~`number`~~ | ~~`0`~~
`nsfw` | No | Blocks command from being used inside a SFW channel, or a NSFW channel. | `true` - Only for NSFW use, `false` - Only for SFW use. | `null`
`reqArgs` | No | Require message to have command arguments. | `boolean` | `null`
`channelOnly` | No | Requires command to be used in certain channels. |`channelType array` - AKA `guild`, `direct`, `text`, `news` (voice, store, thread, and group DMs are not planning to be supported) | `null`
`description` | No | Short description of the command. | `string` | `*No Description Provided*`
`details` | No | Detailed description of the command. | `string` | `*No Details Provided*`
`requires` | No | What permissions this bot needs to run the command. |`PermissionType array` - AKA any permission type, use `true` as the first item of the array to show that the bot requires all listed permissions. | `null`
`userRequires` | No | What permissions the user needs to run the command. |`PermissionType array` - AKA any permission type, use `true` as the first item of the array to show that the user requires all listed permissions. | `null`
`private` | No | Prevents command from being discovered in the help menu. | `boolean` | `null`
`admin` | No | Prevents command from being loaded, unloaded, reloaded, guild unloaded, or guild loaded. | `boolean` | `null`
`fallback` | No | If an invalid command is supplied by the user, then it'll run this command. | `boolean` | `null`
`ownerOnly` | No | If the command is to be used by the owner only. | `boolean` | `null`

## What Options a Config Has
Option | Required | Short Description | Parameter | Default
-|-|-|-|-
token | Yes | Logs into bot. | Bot Token | `*`
owners | No | Allows users to do `ownerOnly` commands. | User IDs | `*`
prefixes | Yes | A short amount of characters before the command. | `string array` | *
srcDirname | Yes | A directory where you put your commands in. | `string` | `xteal`
doSqliteManagement | No | An option to toggle hourly backups and minutely cooldown purges | `boolean` | `true`
doOwnerCooldowns | No | If bot owners should have cooldowns. | `boolean` | `true`
doCooldowns | No | (Unrecommended to turn off) If everyone should have cooldowns. | `boolean` | `true`
doInBetweenCooldowns | No | If there should be waits in between using other commands. | `boolean` | `true`
respondToBadCommands | No | If the bot should respond and delete to commands that don't exist | `boolean` | `true`

## Util Commands
Name | Function | Usage | Flags
-|-|-|-
`eval` | Evaluate Javascript Code. | `eval <*>` | ownerOnly, private, admin
`guildload` | Loads guild-unloaded command into guild. | `guildload <-g, -e> <group/name>` | reqArgs, admin
`guildprefix` | Assigns unique prefix to guild. | `guildprefix <prefix OR none>` | reqArgs, admin
`guildunload` | Unloads command, guild specific. | `guildunload <-g, -e> <group/name>` | reqArgs, admin
`help` | Shows details about a command. | `help <command>` | None
`imposter` | Run a command under another user. | `imposter <username> <command> <command arguments>` | reqArgs, admin, ownerOnly
`info` | Show technical bot details... | `No Syntax` | None
`kill` | Kills bot. | `kill <reason>` | ownerOnly, private, admin
`load` | Globally loads command. | `load <-g, -e> <group OR command/alias>` | ownerOnly, private, admin, reqArgs
`lookup` | Lookup any user via ID. | `lookup <userID>` | admin, reqArgs
`maintenance` | Sends bot into ownerOnly use. | `maintenance <-s> <reason>` | ownerOnly, private, admin
`ping` | Pings the bot | `No Syntax` | admin
`reload` | Globally reloads command. | `reload <-g, -e> <group OR command/alias>` | ownerOnly, private, admin, reqArgs
`restart` | Restarts bot. | `No Syntax` | ownerOnly, private, admin
`spoofCooldown` | Set or clear a user's cooldown. | `spoofCooldown <user> <command> <time? (defaults to Date.now())>` | ownerOnly, private, admin, reqArgs
`unload` | Globally unloads command. | `unload <-g, -e> <group OR command/alias>` | ownerOnly, private, admin, reqArgs