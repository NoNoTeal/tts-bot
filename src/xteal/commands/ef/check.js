var Command = require('../../../util/essentials/Command.js');
const { check } = require('../../cache/list.js');
class checkUser extends Command {
    constructor(client) {
        super(client, {
            name: 'checkuser',
            cooldown: 5,
            group:'ef',
            syntax: 'checkuser <name> <minimized version?> <name history?>',
            channelOnly: ['guild'],
            description: 'Checks if a user played on a forbidden Minecraft server.',
            details: 'Checks if a user played on a forbidden Minecraft server. Defaults to Alco_Rs11',
        })
    }
    async run(message, args) {
        check(message, args[0] || 'Alco_Rs11', undefined, undefined, undefined, args[1] ? args[1].toLowerCase() == 'yes' ? true : false : false, args[2] ?  args[2].toLowerCase() == 'yes' ? true : false : false);
    }};
module.exports = checkUser;