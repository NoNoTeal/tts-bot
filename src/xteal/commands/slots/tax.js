"use strict"
const Command = require('./../../../util/essentials/Command');
class tax extends Command {
  constructor(client) {
    super(client, {
    name: 'tax',
    group: 'slots',
    syntax: 'tax <amount>',
    cooldown: 5,
    reqArgs: true,
    description: 'Get the tax amount, original, and amount taken off of a coin amount (helpful for gift)',
    })}
    async run (message, args, guild) {
    var amount = null
    if(args[0].length > 100) return message.channel.send(`💳 **|** Your number is too long.`)
        try{
    amount = parseInt(args[0].match(/\d+/)[0])
        } catch {message.channel.send(`💳 **|** Syntax: \`${this.syntax}\``)}
    var tax = 0.10
    function calc(a){
    var arr = []
    arr.push(Math.floor(a))
    arr.push(Math.floor(a * tax))
    arr.push(Math.floor(a - a * tax))
    arr.push(Math.floor(a * 1.12))
    return arr
    }
    message.channel.send(`💳 **|** **Table** - 10% Tax
\`\`\`md
Original Amount | ${calc(amount)[0]}
Tax             | ${calc(amount)[1]}
Amount - Tax    | ${calc(amount)[2]}
Get Rid of Tax  | ${calc(amount)[3]}
\`\`\``, {allowedMentions:{parse:[],users:[],roles:[]}})
    }
}
module.exports=tax;