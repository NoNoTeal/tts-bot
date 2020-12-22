"use strict";
const Command = require('./../../../util/essentials/Command');
class slots extends Command {
  constructor(client) {
    super(client, {
    name: 'slots',
    group: 'slots',
    syntax: 'slots <amount>',
    aliases: ['slot'],
    cooldown: 5,
    description: 'Bet an amount of coins, get more or less.',
    })}
    async run (message, args) {
        const client = message.client
        let score = client.getCoin.get(message.author.id);
        if (!score) {
            score = {
              user: message.author.id,
              amount: 0,
              dailyLimitStart: 0,
              streak: 0,
              streaks: 0,
            }
        }
        if(score.amount < 0) {score.amount=0;message.client.setCoin.run(score);}
        if(score.amount <= 10) {return message.channel.send(`You are too cheap to slot!`)}
var multiplier = 1;
var slotType = [
[30,`🍌`],
[30,`🍋`],
[30,`🍍`],
[30,`🍊`],
[30,`🍑`],
[25,`🥭`],
[25,`🍎`],
[25,`🍉`],
[25,`🍓`],
[25,`🍒`],
[25,`🍇`],
[20,`🥝`],
[20,`🍏`],
[15,`🍈`],
[15,`🍐`],
[15,`🥥`],
[15,`🇱🇻`],
[15,`🔔`],
[15,`💎`],
[10,`7️⃣`],
];

const totalWeight = slotType.reduce((a, [weight]) => a + weight, 0);
const weightObj = {};
let weightUsed = 0;
for (const item of slotType) {
  weightUsed += item[0];
  weightObj[weightUsed] = item;
}
const keys = Object.keys(weightObj);
const generate = () => {
  const rand = Math.floor(Math.random() * totalWeight);
  const key = keys.find(key => rand < key);
  return weightObj[key][1];
};
var gen = []
for (let i = 0; i < 27; i++) {
  gen.push(generate())
}

gen.push(`➖`)

        var newArgs = []
        for(var a of args) {
          try{
            newArgs.push(a.match(/\d+/g)[0])
          } catch {newArgs.push(10)}
        }
        var bet = 10;
        if(!newArgs.length) {bet = 10}
        if(!newArgs[0]) {bet = 10}
        else bet = parseInt(newArgs[0])
        if(parseInt(newArgs[0]) > score.amount) return message.channel.send(`You can't bet more than you have!`)
        if(parseInt(newArgs[0]) > 1000000000000) bet = 1000000000000;
        if(parseInt(newArgs[0]) <= 0) bet = 10;
        if(isNaN(newArgs[0])) bet = 10;

        var coin = bet > 1 ? 'coins' : 'coin'

        score.amount -= bet
        if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
        client.setCoin.run(score)
        var slotMSG = await message.channel.send(
`**${message.author}**'s Slot Machine - **${bet}** ${coin}
───────────────────
**[**    *Spinning Slots...*   **]**
 ────────
**|**     ${gen[18]} : ${gen[19]} : ${gen[20]}     **|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|->** ${gen[21]} : ${gen[22]} : ${gen[23]} **<-|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|**     ${gen[24]} : ${gen[25]} : ${gen[26]}     **|**
 ────────
**[**  **Output** [             ]   **]**`
, {allowedMentions:{parse:[],users:[],roles:[]}})

setTimeout(() => {
slotMSG.edit(
`**${message.author}**'s Slot Machine - **${bet}** ${coin}
───────────────────
**[**    *Spinning Slots...*   **]**
 ────────
**|**     ${gen[9]} : ${gen[10]} : ${gen[11]}     **|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|->** ${gen[12]} : ${gen[13]} : ${gen[14]} **<-|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|**     ${gen[15]} : ${gen[16]} : ${gen[17]}     **|**
 ────────
**[**  **Output** [             ]   **]**`
  
, {allowedMentions:{parse:[],users:[],roles:[]}})
}, 1000)

setTimeout(() => {
  const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }
  const allEqual = arr => arr.every( v => v === arr[0])
  var mp;
  if(findDuplicates([gen[3],gen[4],gen[5]]).length) {

      mp = 0;
    if(allEqual([gen[3],gen[4],gen[5]])) {
      mp = 0.5;
    }
 
switch(findDuplicates([gen[3],gen[4],gen[5]])[0]) {
case `🍌`:
  multiplier = 1
break;
case `🍋`:
  multiplier = 1
break;
case `🍍`:
  multiplier = 1
break;
case `🍊`:
  multiplier = 1
break;
case `🍑`:
  multiplier = 1
break;
case `🥭`:
  multiplier = 2
break;
case `🍎`:
  multiplier = 3
break;
case `🍉`:
  multiplier = 3
break;
case `🍓`:
  multiplier = 3
break;
case `🍒`:
  multiplier = 5
break;
case `🍇`:
  multiplier = 5
break;
case `🥥`:
  multiplier = 10
break;
case `🥝`:
  multiplier = 10
break;
case `🍏`:
  multiplier = 10
break;
case `🍈`:
  multiplier = 10
break;
case `🍐`:
  multiplier = 10
break;
case `🇱🇻`:
  multiplier = 20
break;
case `🔔`:
  multiplier = 30
break;
case `💎`:
  multiplier = 40
break;
case `7️⃣`:
  multiplier = 50;
break;
    }

var final = Math.floor(bet * (multiplier + mp));
coin = final > 1 ? 'coins' : 'coin'
    slotMSG.edit(
`**${message.author}**'s Slot Machine - **${bet}** ${coin}
───────────────────
**[**   *YOUR RESULTS*    **]**
 ────────
**|**     ${gen[0]} : ${gen[1]} : ${gen[2]}     **|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|->** ${gen[3]} : ${gen[4]} : ${gen[5]} **<-|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|**     ${gen[6]} : ${gen[7]} : ${gen[8]}     **|**
 ────────
**[** **Output** [Won **${final}** ${coin}] **]**`
      
    , {allowedMentions:{parse:[],users:[],roles:[]}})

    score.amount += final
    if(score.amount > 1000000000000) {score.amount = 1000000000000;message.client.setCoin.run(score);}
    client.setCoin.run(score)

    return

  } else

  slotMSG.edit(
`**${message.author}**'s Slot Machine - **${bet}** ${coin}
───────────────────
**[**   *YOUR RESULTS*    **]**
 ────────
**|**     ${gen[0]} : ${gen[1]} : ${gen[2]}     **|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|->** ${gen[3]} : ${gen[4]} : ${gen[5]} **<-|**
**|**     ${gen[27]} : ${gen[27]} : ${gen[27]}     **|**
**|**     ${gen[6]} : ${gen[7]} : ${gen[8]}     **|**
 ────────
**[** **Output** [Lost **${bet}** ${coin}] **]**`
    
  , {allowedMentions:{parse:[],users:[],roles:[]}})
  }, 2000)
        

    }
}
module.exports=slots;