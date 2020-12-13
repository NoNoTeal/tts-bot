/* 
 * I see you found my secret command stash! Or so called "secret"
 * stash. You can delete these commands, they're not required,
 * but I would recommend you keep them in. Feel free to change the
 * code as well! Also feel free to use these files as a reference
 * point when you want to make your own commands. If you think you
 * found a bug, report it on the issues tracker or make a pull rq.
 * 
 * (If you are getting rid of these, get rid of the following code
 * in Verify.js):     Command.globalReload(bot, 'util/essentials');
 */
"use strict";
const Command = require('./../../Command.js');
const Discord = require('discord.js');
const pkg = require('./../../../../../package.json');
const os = require('os');
const c_p = require('child_process');
const si = require('systeminformation');
const { getCombinedSize, getAllFiles } = require('./../../Util');
class info extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            group: 'Util',
            cooldown: 5,
            description: 'View Bot\'s Info',
            details: 'View Bot Information such as CPU Usage, Disk Storage.',
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
        var npmver = ''

        function sizeize(num) {
            var type = 0;
            var value = num;
            while(Math.trunc(value/1000)) {
            value = value / 1000;
            type++;
            }
            var size = value > 1 ? 'Bytes' : 'Byte';
            switch(type) {
              case 0 :
                size = value > 1 ? 'Bytes' : 'Byte';
              break;
              case 1:
                size = 'KB';
              break;
              case 2:
                size = 'MB';
              break;
              case 3:
                size = 'GB';
              break;
              case 4:
                size = 'TB';
              break;
            }
            return `${value.toString().slice(0, value.toString().indexOf('.') + 3)} ${size}`;
        }
        function msToTime(duration) {
                var seconds = Math.floor((duration / 1000) % 60),
                  minutes = Math.floor((duration / (1000 * 60)) % 60),
                  hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
                  days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 24);

                var filtered = [`${days} ${days > 1 ? 'Days' : 'Day'}`,`${hours} ${hours > 1 ? 'Hours' : 'Hour'}`,`${minutes} ${minutes > 1 ? 'Minutes' : 'Minute'}`,`${seconds} ${seconds > 1 ? 'Seconds' : 'Second'}`].filter(n => parseInt(n) > 0);
              
                return filtered.join(', ');
        }

        c_p.exec('npm -version', async (e,s,er) => {
            npmver = s.split('\n')
        var embed = new Discord.MessageEmbed()
        .setTitle(`${message.client.user.username} Info`)
        .addField(`**System Info**`, '\u200b')

        .addField(`Operating System`,`**${(await si.osInfo()).distro} ${(await si.osInfo()).release} (${(await si.osInfo()).build})** ${process.arch}
        **Uptime** - ${msToTime(os.uptime())}
        **Kernel** - ${(await si.osInfo()).kernel}
        **Model** - ${(await si.system()).model}
        **Manufacturer** - ${(await si.system()).manufacturer}\n
        **Battery Charge** - ${(await si.battery()).ischarging}
        **Battery Percent** - ${(await si.battery()).percent}%
        **Charging?** - ${(await si.battery()).acconnected}`,true)
        .addField(`Hardware Memory`,`**${sizeize((await si.mem()).total)}** - Total
        **${sizeize((await si.mem()).used)}** - Used
        **${sizeize((await si.mem()).free)}** - Free\n
        **${sizeize((await si.mem()).active)}** - Active
        **${sizeize((await si.mem()).available)}** - Available\n
        **${sizeize((await si.mem()).swaptotal)}** - Total Swap
        **${sizeize((await si.mem()).swapused)}** - Used Swap
        **${sizeize((await si.mem()).swapfree)}** - Free Swap`, true)
        .addField(`CPU Info`, `**${os.cpus()[0].model}** - Model
        **${(await si.cpu()).cores}** - Cores
        **${(await si.cpu()).physicalCores}** - Physical Cores
        **${(await si.cpu()).processors}** - Processors\n
        **${(await si.cpu()).speed}GHz** - Speed
        **${(await si.cpu()).speedmax}GHz** - Max Speed
        **${(await si.cpuCurrentspeed()).avg}GHz** - Average Speed
        **${(await si.cpu()).vendor}** - Vendor`, true)

        .addField(`Versions`, 
        `**[${process.version.slice(1)}](https://nodejs.org/download/release/${process.version})** - Node
        **[${!pkg.dependencies['discord.js'].startsWith('github') ? pkg.dependencies['discord.js'].slice(1) : 'Github Commit'}](${!pkg.dependencies['discord.js'].startsWith('github')? `https://npmjs.com/package/discord.js/v/${pkg.dependencies['discord.js'].slice(1)}` : `https://github.com/discordjs/discord.js/commit/${pkg.dependencies['discord.js'].split('#').slice(1)}`})** - Discord.JS
        **[${npmver[0]}](https://www.npmjs.com/get-npm)** - NPM
        **${pkg.version}** - Bot`, true)
        .addField(`Process Info`,
       `**${sizeize(process.memoryUsage().heapTotal)}** Total
        **${sizeize(process.memoryUsage().heapUsed)}** Used
        **${sizeize((process.memoryUsage().heapTotal - process.memoryUsage().heapUsed))}** Free
        **${sizeize(getCombinedSize(getAllFiles(`./`, null, "")))}** Node Folder`, true)
        .addField(`Disk Storage`, `
        **${sizeize((await si.fsSize())[0].size)}** - Total
        **${sizeize((await si.fsSize())[0].used)}** - Used
        **${sizeize(((await si.fsSize())[0].size - (await si.fsSize())[0].used))}** - Free
        **${(await si.diskLayout())[0].name}** - Drive Name`,true)

        .addField(`Uptime`, 
        `**${msToTime(process.uptime() * 1000)}** - Node
        **${msToTime(message.client.uptime)}** - Bot`, true)
        .addField(`Node.JS`, 
        `**${process.pid}** - Process ID
        **${process.ppid}** - Parent Process ID`, true)
        .addField(`CPU Load`, 
        `**${Math.round((await si.currentLoad()).currentload_user)}%** - User
        **${Math.round((await si.currentLoad()).currentload_system)}%** - System`, true)

        .setTimestamp()
        message.channel.send(embed)
        })
    }
}
module.exports = info;