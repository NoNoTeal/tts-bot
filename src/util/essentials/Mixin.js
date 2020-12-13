const sqlite = require(`better-sqlite3`);
const fs = require('fs');
const Discord = require('discord.js');
const Util = require('./Util');
/**
 * @param {Discord.Client} bot
 */
module.exports = bot => {

    console.log('---------Running Mixin.js---------');

    if(!fs.existsSync(`./src/xteal/util-cache/coins.sqlite`)) {
      fs.mkdirSync(`./src/xteal/util-cache`, {recursive: true})
      fs.createWriteStream(`./src/xteal/util-cache/coins.sqlite`, {flags: 'a+'});
      console.debug('Created file coins.sqlite');
    };
    if(!fs.existsSync(`./src/xteal/util-cache/tatsu.sqlite`)) {
      fs.mkdirSync(`./src/xteal/util-cache`, {recursive: true})
      fs.createWriteStream(`./src/xteal/util-cache/tatsu.sqlite`, {flags: 'a+'});
      console.debug('Created file tatsu.sqlite');
    };

    var Coins = sqlite(`./src/xteal/util-cache/coins.sqlite`);
    var Info = sqlite(`./src/xteal/util-cache/tatsu.sqlite`);

    console.log('Preparing Coins (ttsbot extension)');

    var coinstable = Coins.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'coins';").get();
    if (!coinstable['count(*)']) {
      Coins.prepare("CREATE TABLE coins (user TEXT, amount INTEGER, dailyLimitStart INTEGER, streak INTEGER, streaks INTEGER);").run();
      Coins.prepare("CREATE UNIQUE INDEX idx_coins_user ON coins (user);").run();
      Coins.pragma("synchronous = 1");
      Coins.pragma("journal_mode = wal");
    }
    bot.getCoin = Coins.prepare("SELECT * FROM coins WHERE user = ?");
    bot.getTopCoin = Coins.prepare("SELECT *, RANK () OVER (ORDER BY amount DESC) rank FROM coins WHERE ',' || ? || ',' LIKE '%,' || user || ',%'");
    bot.getAllCoin = Coins.prepare("SELECT *, RANK () OVER (ORDER BY amount DESC) rank FROM coins");
    bot.setCoin = Coins.prepare("INSERT OR REPLACE INTO coins (user, amount, dailyLimitStart, streak, streaks) VALUES (@user, @amount, @dailyLimitStart, @streak, @streaks);");

    console.log('Preparing Levels/Info (ttsbot extension)');

    var infotable = Info.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'info';").get();
    if (!infotable['count(*)']) {
      Info.prepare("CREATE TABLE info (user TEXT, infotext TEXT, rep INTEGER, level INTEGER, xp INTEGER, badges TEXT);").run();
      Info.prepare("CREATE UNIQUE INDEX idx_info_user ON info (user);").run();
      Info.pragma("synchronous = 1");
      Info.pragma("journal_mode = wal");
    }
    bot.getInfo = Info.prepare("SELECT * FROM info WHERE user = ?");
    bot.getTopInfo = Info.prepare("SELECT *, RANK () OVER (ORDER BY level DESC, xp DESC) rank FROM info WHERE ',' || ? || ',' LIKE '%,' || user || ',%'");
    bot.getAllInfo = Info.prepare("SELECT *, RANK () OVER (ORDER BY level DESC, xp DESC) rank FROM info");
    bot.setInfo = Info.prepare("INSERT OR REPLACE INTO info (user, infotext, rep, level, xp, badges) VALUES (@user, @infotext, @rep, @level, @xp, @badges);");
  
    bot.on('message', (msg) => {
        if(msg.author.bot) return;
        if(Math.random() > 0.7) {
          let coins = bot.getCoin.get(msg.author.id);
          if (!coins) {
            coins = {
              user: msg.author.id,
              amount: 0,
              dailyLimitStart: 0,
              streak: 0,
              streaks: 0,   
            }
          }
          coins.amount = coins.amount + Util.randomIntFromInterval(1, 7);
          bot.setCoin.run(coins);
        }
        let score = bot.getInfo.get(msg.author.id);
        if (!score) {
          score = {
            user: msg.author.id,
            infotext: "I'm a person.",
            rep: 0,
            level: 1,
            xp: 0,
            badges: JSON.stringify([]),
          }
        }
        score.xp++;
        var badges = JSON.parse(score.badges);
        const curLevel = Math.floor(0.3 * Math.sqrt(score.xp));
        if(score.level <= curLevel) {
          score.level++;
          var level = score.level
          msg.channel.send(`⬆️ **|** ${msg.author}, you've leveled up to **${score.level}**!`, {allowedMentions:{parse: [],roles:[], users:[]}});
            if (level >= 5) {
              giveBadge([`5️⃣`, `5`]);
            }
            if (level >= 10) {
              giveBadge([`🧩`,`Missing Piece`]);
            }
            if (level >= 20) {
              giveBadge([`🦪`,`Hidden Pearl`]);
            }
            if (level >= 30) {
              giveBadge([`🎮`,`Gamer`]);
            }
            if (level >= 40) {
              giveBadge([`🌠`,`Star`]);
            }
            if (level >= 50) {
              giveBadge([`🥉`,`Tryhard`]);
            }
            if (level >= 60) {
              giveBadge([`⛏️`,`Pickaxe`]);
            }
            if (level >= 70) {
              giveBadge([`🔧`,`Banger`]);
            }
            if (level >= 80) {
              giveBadge([`🥈`,`When will it stop?`]);
            }
            if (level >= 90) {
              giveBadge([`🧲`,`Attractive force`]);
            }
            if (level >= 100) {
              giveBadge([`💯`,`Magical 100`]);
            }
            if (level >= 110) {
              giveBadge([`㊙️`,`Secret Bonus`]);
            }
            if (level >= 120) {
              giveBadge([`🌌`,`Mystical`]);
            }
            if (level >= 130) {
              giveBadge([`🏅`,`Ultra Talk`]);
            }
            if (level >= 140) {
              giveBadge([`‼️`,`Has to be the last one!`]);
            }
            if (level >= 150) {
              giveBadge([`🥇`,`Limited Medal!`]);
            }
            if (level >= 200) {
              giveBadge([`💎`,`Hidden Gem`]);
            }
          score.xp = 0;
        };
        function giveBadge(name) {
          if(badges.find(v => JSON.stringify(v) === JSON.stringify(name))) return;
          badges.push(name);
          msg.channel.send(`📛 **|** ${msg.author} received a badge! ${name[0]} **|** ${name[1]}`, {allowedMentions:{parse: [],roles:[], users:[]}})
        }
        score.badges = JSON.stringify(badges);
        bot.setInfo.run(score);
    })

    console.log('---------Finished Running Mixin.js---------');
}