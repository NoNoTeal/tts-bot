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
            message.channel.send(`📛 **|** ${messages.author} received a badge! ${name[0]} **|** ${name[1]}`, {allowedMentions:{parse: [],roles:[], users:[]}});
            message.client.setInfo.run(profile);
        }
        if(profile.rep > 1000000) {this.cancelThrottle(message.author);return message.channel.send(`User has gained enough reputation!`)}
        profile.rep++;
        switch(true) {
            case (profile.rep >= 5):
              giveBadge([`👀`, `Starting out?`]);
            
            case (profile.rep >= 10):
              giveBadge([`📛`,`Your name`]);
            
            case (profile.rep >= 20):
              giveBadge([`💾`,`Rep Saver`]);
            
            case (profile.rep >= 30):
              giveBadge([`💬`,`Known`]);
            
            case (profile.rep >= 40):
              giveBadge([`🧴`,`Sanitized`]);
            
            case (profile.rep >= 50):
              giveBadge([`📟`,`Here`]);
            
            case (profile.rep >= 60):
              giveBadge([`🎫`,`Bucket of Rep`]);
            
            case (profile.rep >= 70):
              giveBadge([`📑`,`Page of Reps`]);
            
            case (profile.rep >= 80):
              giveBadge([`⛵`,`Overseas`]);
            
            case (profile.rep >= 90):
              giveBadge([`😆`,`Lmfao`]);
            
            case (profile.rep >= 100):
              giveBadge([`👍`,`100 Rep`]);
            
            case (profile.rep >= 150):
              giveBadge([`⚠️`,`Rep Overload!`]);
            
            case (profile.rep >= 200):
              giveBadge([`⌛`,`Alt Rep`]);
            
            case (profile.rep >= 250):
              giveBadge([`📥`,`Inbox of Rep`]);
            
            case (profile.rep >= 300):
              giveBadge([`‼`,`Bang`]);
            
            case (profile.rep >= 350):
              giveBadge([`⌨️`,`Keyboard Smasher`]);
            
            case (profile.rep >= 400):
              giveBadge([`🤯`,`Social Worker`]);
            
            case (profile.rep >= 450):
              giveBadge([`😫`,`Emotional Tinkerer`]);
            
            case (profile.rep >= 500):
              giveBadge([`📈`,`Rep Uprise`]);
            
            case (profile.rep >= 1000):
              giveBadge([`💕`,`Last One`]);
            
        }
        message.channel.send(`🗨️ **|** ${user} has been repped!`, {allowedMentions:{parse: [],roles:[], users:[]}})
        message.client.setInfo.run(profile);
    }};
module.exports = rep;