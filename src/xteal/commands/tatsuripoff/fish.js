var Command = require('../../../util/essentials/Command.js');
const Discord = require('discord.js');
const Util = require('../../../util/essentials/Util.js');
const probabilityFishChart = [
    [7, '👞'],
    [7, '🥾'],
    [7, '🍼'],
    [7, '🍾'],
    [7, '📎'],
    [7, '🖇'],
    [7, '🔗'],
    [7, '🔧'],
    [7, '🔋'],
    [7, '👢'],
    [5, '🐟'],
    [4, '🐠'],
    [4, '🐡'],
    [0.5, '🐙'],
    [0.25, '🦑'], 
];
class fish extends Command {
    constructor(client) {
        super(client, {
            name: 'fish',
            cooldown: 5,
            group:'tatsuripoff',
            description: 'Fish for something!',
            syntax: 'fish <sell|stats|collection|trade|inventory>',
        })
    }
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    async run(message, args) {
        var fishProfile = message.client.getFish.get(message.author.id);
        if(!fishProfile) {
            fishProfile = {
                user: message.author.id,
                cooldown: 0,
                common: 0,
                uncommon: 0,
                rare: 0,
                garbage: 0,
                sold: JSON.stringify({
                    common: 0,
                    uncommon: 0,
                    rare: 0,
                    garbage: 0,
                }),
                collection: JSON.stringify([]),
            }
        }
        let score = message.client.getCoin.get(message.author.id);
        if (!score) {
          score = {
            user: message.author.id,
            amount: 0,
            dailyLimitStart: 0,
            streak: 0,
            streaks: 0,   
          }
        }
        switch(args[0] !== undefined ? args[0].toLowerCase() : args[0]) {
            case undefined:
                if((Date.now() - fishProfile.cooldown) < 0) return message.channel.send(`🎣 | Please wait \`${Math.round((fishProfile.cooldown - Date.now()) / 1000)}\` seconds before fishing again.`);
                if(!(score.amount > 15)) return message.channel.send(`🎣  | You need 20 coins in order to fish!`);
                var type = Util.randomWeighted(probabilityFishChart, 1)[0];
                if(['👞', '🥾', '🍼', '🍾', '📎', '🖇', '🔗', '🔧', '🔋', '👢'].includes(type)) {
                    message.channel.send('🎣 | You forked over 15 coins and you reeled in... ||'+ type +'||.');
                    score.amount -= 15;
                    fishProfile.garbage++;
                } else if(['🐟', '🐠'].includes(type)) {
                    message.channel.send('🎣 | Nice catch! You got a ||'+ type +'||. You payed **15** coins.');
                    score.amount -= 15;
                    type == '🐟' ? fishProfile.common++ : fishProfile.uncommon++;
                } else if(type == '🐡') {
                    message.channel.send('🎣 | OUCH! You reeled in a ||'+ type +'|| and dropped it back into the ocean. You paid **20** coins for bandages.');
                    score.amount -=20;
                } else if(type == '🐙') {
                    message.channel.send('🎣 | Impressive! You got a ||'+ type +'||. Put it in your collection. You payed **15** coins.');
                    score.amount -= 15;
                    fishProfile.rare++;
                    fishProfile.collection = JSON.parse(fishProfile.collection);
                    fishProfile.collection.push(type);
                    fishProfile.collection = JSON.stringify(fishProfile.collection);
                } else if(type == '🦑') {
                    message.channel.send('🎣 | Awesome! You got a ||'+ type +'||. Put it in your collection. You payed **15** coins.');
                    score.amount -= 15;
                    fishProfile.rare++;
                    fishProfile.collection = JSON.parse(fishProfile.collection);
                    fishProfile.collection.push(type);
                    fishProfile.collection = JSON.stringify(fishProfile.collection);
                }
                message.client.setCoin.run(score);
                fishProfile.cooldown = Date.now()+30000;
                message.client.setFish.run(fishProfile);
            break;
            case 'sell':
                var total;
                fishProfile.sold = JSON.parse(fishProfile.sold);
                switch(args[1] !== undefined ? args[1].toLowerCase() : args[1]) {
                    case 'common':
                        if(fishProfile.common == 0) return message.channel.send(`🎣 | You don't have any common fish to sell!`);
                        total = fishProfile.common * 20;
                        message.channel.send(`🎣 | You sold **__${fishProfile.common}__** 🐟 for **__${total}__** coins.`)
                        fishProfile.sold['common']+=fishProfile.common;
                        fishProfile.common = 0;
                        score.amount+=total;
                        fishProfile.sold = JSON.stringify(fishProfile.sold);
                        message.client.setFish.run(fishProfile);
                        message.client.setCoin.run(score);
                    break;
                    case 'uncommon':
                        if(fishProfile.uncommon == 0) return message.channel.send(`🎣 | You don't have any uncommon fish to sell!`);
                        total = fishProfile.uncommon * 30;
                        message.channel.send(`🎣 | You sold **__${fishProfile.uncommon}__** 🐠 for **__${total}__** coins.`)
                        fishProfile.sold['uncommon']+=fishProfile.uncommon;
                        fishProfile.uncommon = 0;
                        score.amount+=total;
                        fishProfile.sold = JSON.stringify(fishProfile.sold);
                        message.client.setFish.run(fishProfile);
                        message.client.setCoin.run(score);
                    break;
                    case 'rare':
                        message.channel.send(`You cannot sell rare fish. Please trade it instead.`)
                    break;
                    case 'garbage':
                        if(fishProfile.garbage == 0) return message.channel.send(`🎣 | You don't have any garbage to sell!`);
                        total = fishProfile.garbage * 7;
                        message.channel.send(`🎣 | For helping with ocean pollution, you sold **__${fishProfile.garbage}__** garbage for **__${total}__** coins.`)
                        fishProfile.sold['garbage']+=fishProfile.garbage;
                        fishProfile.garbage = 0;
                        score.amount+=total;
                        fishProfile.sold = JSON.stringify(fishProfile.sold);
                        message.client.setFish.run(fishProfile);
                        message.client.setCoin.run(score);
                    break;
                    default:
                        message.channel.send(`A wrong parameter was given! You do \`fish sell <common|uncommon|garbage>\`!`)
                    break;
                }

            break;
            case 'stats':
                fishProfile.sold = JSON.parse(fishProfile.sold);
                message.channel.send(`🎣 | **${message.author.username}'s** fishing stats:
🐟 Common | **__${fishProfile.common + fishProfile.sold['common']}__** 
🐠 Uncommon | **__${fishProfile.uncommon + fishProfile.sold['uncommon']}__**
🐙 Rare | **__${fishProfile.rare + fishProfile.sold['rare']}__**
----------------
**__${fishProfile.common + fishProfile.uncommon + fishProfile.rare + fishProfile.sold['common'] + fishProfile.sold['uncommon'] + fishProfile.sold['rare']}__** total
----------------
🗑️ Garbage | **__${fishProfile.garbage + fishProfile.sold['garbage']}__**`)
            break;
            case 'inventory':
                message.channel.send(`🎣 | **${message.author.username}'s** fish inventory:
🐟 Common | **__${fishProfile.common}__** 
🐠 Uncommon | **__${fishProfile.uncommon}__**
🐙 Rare | **__${fishProfile.rare}__** 
----------------
**__${fishProfile.common + fishProfile.uncommon + fishProfile.rare}__** total
----------------
🗑️ Garbage | **__${fishProfile.garbage}__**`)
            break;
            case 'trade':
                fishProfile.collection = JSON.parse(fishProfile.collection);
                fishProfile.sold = JSON.parse(fishProfile.sold);
                var total;
                switch(args[1] !== undefined ? args[1].toLowerCase() : args[1]) {
                    case 'octopus':
                        var octopuses = fishProfile.collection.filter(t => t == '🐙');
                        total = octopuses.length * 200;
                        message.channel.send(`🎣 | You traded **__${octopuses.length}__** 🐙 with a collector for **__${total}__** coins.`)
                        fishProfile.sold['rare']+=octopuses.length;
                        fishProfile.rare-=octopuses.length;
                        score.amount+=total;
                        fishProfile.sold = JSON.stringify(fishProfile.sold);
                        fishProfile.collection = JSON.stringify(fishProfile.collection.filter(t => t !== '🐙'));
                        message.client.setFish.run(fishProfile);
                        message.client.setCoin.run(score);
                    break;
                    case 'squid':
                        var squid = fishProfile.collection.filter(t => t == '🦑');
                        total = squid.length * 500;
                        message.channel.send(`🎣 | You traded **__${squid.length}__** 🦑 with a collector for **__${total}__** coins.`)
                        fishProfile.sold['rare']+=squid.length;
                        fishProfile.rare-=squid.length;
                        score.amount+=total;
                        fishProfile.sold = JSON.stringify(fishProfile.sold);
                        fishProfile.collection = JSON.stringify(fishProfile.collection.filter(t => t !== '🦑'));
                        message.client.setFish.run(fishProfile);
                        message.client.setCoin.run(score);
                    break;
                    default:
                        message.channel.send(`A wrong parameter was given! You do \`fish trade <octopus|squid>\`!`)
                    break;
                }
            break;
            case 'collection':
                fishProfile.collection = JSON.parse(fishProfile.collection);
                var octopuses = fishProfile.collection.filter(t => t == '🐙');
                var squid = fishProfile.collection.filter(t => t == '🦑');
                message.channel.send(`🎣 | You have **__${octopuses.length}__** 🐙, and **__${squid.length}__** 🦑.`)
            break;
            default:
                message.channel.send(`A wrong parameter was given! Choose from \`fish <sell|stats|collection|trade|inventory>\` or leave blank to cast your rod!`)
            break;
        }
    }};
module.exports = fish;