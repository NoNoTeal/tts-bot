var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const Util = require('../../../util/essentials/Util.js');
class rep extends Command {
    constructor(client) {
        super(client, {
            name: 'rep',
            cooldown: 86400,
            group:'tatsumaki',
            channelOnly: ['guild'],
            syntax: `rep <user>`,
            reqArgs: true,
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
      var user = await Util.userParsePlus(message, args, 'user');
        if(!user) {
            this.throttle(message.author, 5);
            return message.channel.send(`🗃️ **|** You didn't put a valid user! See \`${this.syntax}\``)};
        if(user.id === message.author.id) {
            this.throttle(message.author, 5);
            return message.channel.send(`🗃️ **|** You can't rep yourself.`)};
        if(user.bot) {
            this.throttle(message.author, 5);
            return message.channel.send(`🗃️ **|** You can't rep bots.`);}
        let profile = message.client.getInfo.get(user.id);
        if (!profile) {
            profile = {
                user: user.id,
                infotext: "I'm a person.",
                rep: 0,
                level: 1,
                xp: 0,
                badges: JSON.stringify([]),
            }
        }
        var badges = JSON.parse(profile.badges);
        function giveBadge(name) {
          if(badges.find(v => JSON.stringify(v) === JSON.stringify(name))) return;
            badges.push(name);
            profile.badges = JSON.stringify(badges);
            message.channel.send(`📛 **|** <@${profile.user}> received a badge! ${name[0]} **|** ${name[1]}`, {allowedMentions:{parse: [],roles:[], users:[]}});
            message.client.setInfo.run(profile);
        }
        if(profile.rep > 1000000) {this.cancelThrottle(message.author);return message.channel.send(`User has gained enough reputation!`)}
        profile.rep++;
        switch(true) {
            case (profile.rep >= 5):
              giveBadge([`👀`, `Starting out?`]);
            break;
            case (profile.rep >= 10):
              giveBadge([`📛`,`Your name`]);
            break;
            case (profile.rep >= 20):
              giveBadge([`💾`,`Rep Saver`]);
            break;
            case (profile.rep >= 30):
              giveBadge([`💬`,`Known`]);
            break;
            case (profile.rep >= 40):
              giveBadge([`🧴`,`Sanitized`]);
            break;
            case (profile.rep >= 50):
              giveBadge([`📟`,`Here`]);
            break;
            case (profile.rep >= 60):
              giveBadge([`🎫`,`Bucket of Rep`]);
            break;
            case (profile.rep >= 70):
              giveBadge([`📑`,`Page of Reps`]);
            break;
            case (profile.rep >= 80):
              giveBadge([`⛵`,`Overseas`]);
            break;
            case (profile.rep >= 90):
              giveBadge([`😆`,`Lmfao`]);
            break;
            case (profile.rep >= 100):
              giveBadge([`👍`,`100 Rep`]);
            break;
            case (profile.rep >= 150):
              giveBadge([`⚠️`,`Rep Overload!`]);
            break;
            case (profile.rep >= 200):
              giveBadge([`⌛`,`Alt Rep`]);
            break;
            case (profile.rep >= 250):
              giveBadge([`📥`,`Inbox of Rep`]);
            break;
            case (profile.rep >= 300):
              giveBadge([`‼`,`Bang`]);
            break;
            case (profile.rep >= 350):
              giveBadge([`⌨️`,`Keyboard Smasher`]);
            break;
            case (profile.rep >= 400):
              giveBadge([`🤯`,`Social Worker`]);
              break;
            case (profile.rep >= 450):
              giveBadge([`😫`,`Emotional Tinkerer`]);
              break;
            case (profile.rep >= 500):
              giveBadge([`📈`,`Rep Uprise`]);
              break;
            case (profile.rep >= 1000):
              giveBadge([`💕`,`Last One`]);
              break;
        }
        message.channel.send(`🗨️ **|** ${user} has been repped!`, {allowedMentions:{parse: [],roles:[], users:[]}})
        message.client.setInfo.run(profile);
    }};
module.exports = rep;