const djs = require('discord.js')
const { token } = require('./src/util/config.json')
const client = new djs.Client();
var Constants = require('./node_modules/discord.js/src/util/Constants.js')
/**
 * @link https://github.com/KJP12
 * @type {'Discord.JS'|'Discord iOS'|'Discord Android'|'Discord Browser'}
 */
Constants.DefaultOptions.ws.properties.$browser = 'Discord iOS';
client.login(token)
require('./src/util/essentials/Verify.js')(client);