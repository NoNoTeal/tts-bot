const Util = require('./../essentials/Util.js');
const D = require('discord.js');
function endsWithAny(suffixes, string) {
    return suffixes.some(function (suffix) {
        return string.endsWith(suffix);
    });
}
function capitalizeFirstLetter(sentence, string) {
    if(!sentence.endsWith('.')) return string;
    else return string.charAt(0).toUpperCase() + string.slice(1);
}
const insults = {
    'verbs': [
        //verb: action; e.g. suck
        "suck",
        "fuck",
        "photoshop",
        "burn",
        "lick",
        "touch",
        "stick",
        "milk",
        "stab",
        "feed",
        "screw",
        "blowjob",
        "suck",
        "die",
        "like",
        "stuff",
        "step",
        "cum",
        "cook",
        "fight",
        "ban",
        "ligma",
        "nigma",
        "piss",
        "diarrhea",
        "shit",
        "vomit",
        "regurgitate",
        "fail",
        "break",
        "turn",
        "change",
        "play",
        "die",
        "smash",
        "pass",
        "crash",
        "slam",
        "eat",
        "wanking",
        "jacker",
        "bathing",
        "think",
        "raping",
        "watching",
        "listening",
        "streaming",
        "pirating",
        "acting",
        "simping",
        "knocking",
        "anal pressurizing",
        "resurfacing",
        "lighting",
        "littering",
        "pornography",
        "giving",
        "spreading",
        "passing",
        "singing",
        "sing",
        "sung",
        "injecting",
        "reproducing",
        "penetrating",
        "penetration",
        "penetrated",
        "reproduced",
        "moving",
        "swinging",
        "hammering",
    ],
    'nouns': [
        //noun: object; e.g. bottle
        "bottle",
        "nigger",
        "shithead",
        "jews",
        "hitler",
        "trump",
        "alco",
        "lynx",
        "balls",
        "penis",
        "dick",
        "groin",
        "scrotum",
        "gender bender",
        "homos",
        "transgender",
        "gays",
        "Japanese",
        "Chinese",
        "Korean",
        "japs",
        "germans",
        "sausage and ping pong balls",
        "fucker",
        "dickhead",
        "bitchass",
        "retard",
        "fire extinguisher",
        "umbrella",
        "shoe",
        "wanker",
        "dumbass",
        "dirty person",
        "those",
        "unintelligent",
        "school",
        "shooter",
        "teacher",
        "student",
        "cock",
        "homework",
        "my",
        "me",
        "I",
        "thought",
        "porn",
        "legs",
        "arms",
        "titties",
        "ass",
        "breasts",
        "diarrhea in finger",
        
    ],
    'syncategorematic': [
        //syncategorematic: filler; e.g. and, the,
        "and",
        "the",
        "they",
        "like",
        "a",
        "in",
        "is",
        "how",
        "there",
        "you",
        "thus",
        "to",
        "it",
        "but",
        "get",
        "go",
        "put",
        "your",
        "have",
        "what",
        "are",
        "which",
    ],
    'punctuation': [
        [45, ','],
        [69, '.'],
        [10, ';']
    ]
}
/**
 * 
 * @param {D.Message} int 
 */
module.exports = (int) => {
    switch(int.commandName) {
        case 'test':
            int.reply(`Now sending pictures of ${int['options'][2] ? int['options'][2].value ? 'small-ass' : 'big-ass' : 'big-ass'} ${int['options'][0].value} to <@${int['options'][1].value}>.`)
        break;
        case 'insult':
            var victim = '<@' + int['options'][0].value + '>';
            var length = Util.randomIntFromInterval(50, 90);
            var sentence = `Hey ${victim},`;
            for(var i=0;i<length;i++) {
                if(endsWithAny(insults['nouns'], sentence)) {
                    if(Util.chance(500)) {
                        sentence+=`${Util.randomWeighted(insults['punctuation'], 1)[0]}`;
                    } else sentence+=` ${Math.random() > 0.2 ? Util.randomEqualArray(insults['syncategorematic']) : Util.randomEqualArray(insults['nouns'])}`;
                } else if(endsWithAny(insults['verbs'], sentence)) {
                    sentence+=` ${Util.randomEqualArray(insults['syncategorematic'])}`;
                } else {
                    sentence+=` ${capitalizeFirstLetter(sentence, Math.random() > 0.5 ? Util.randomEqualArray(insults['nouns']) : Util.randomEqualArray(insults['verbs']))}`;
                }
            }
            !sentence.endsWith('.') ? sentence+='.' : '';
            var options = {};
            if(int['options'][1]) {
                if(int['options'][1].value) {
                    options = {allowedMentions: {
                        parse: [],
                        users: [],
                        roles: [],
                    }}
                }
            }
            int.channel.send(sentence, options)
        break;
    }
}