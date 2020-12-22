const Discord = require('discord.js');
const fs = require('fs');
const { owners, prefixes } = require('./../config.json');

/**
 * A various collection of mostly non-D.JS related things. These functions are used in Command.js, don't delete.
 */
class Util {
    /**
     * @typedef {number} Second
     */
    constructor() {
      throw new Error('The util class cannot be constructed.')
    };
    /**
     * Automatically sends and deletes a message for you.
     * @param {string} content
     * @param {Discord.Message} msg
     * @param {Second} time
     * @static
     */
    static automsg(content, msg, time) {
        if(!time || isNaN(time) || time < 1) {
            time = 10;
        };
        msg.channel.send(content.length ? content : '*No AutoMessage Content Sent*').then(m => {
          setTimeout(() => {
            m.delete();
            if(m.guild) {
                if(!m.guild.me.hasPermission('MANAGE_MESSAGES')) return;
                else msg.delete({reason: 'Automatically Deleted Message from Triggering Bot.'});
            }
          }, time*1000);
        });
    };

    /**
     * Checks if provided ID is an owner.
     * @param {Discord.Snowflake} id 
     * @static
     */
    static isOwner(id) {
        return owners.includes(id);
    };

    /**
     * Converts a bit number to an array of enums
     * @param {Number} n 
     */
    static bitNumberToArray(n) {
      const bits = [...n.toString(2)].map(Number);
  
      return bits.reduce((result, bit, index) => result.concat(bit ? bits.length - index - 1 : []), []);
    }

    /**
     * Splits an array into chunks.
     * @param {any[]} arr 
     * @param {Number} num 
     */

    static chunk(arr, num) {
      if(!Array.isArray(arr)) return 'Not an Array';
      if(!Number.isInteger(num)) return 'Use valid number';
      if(num > arr.length) return 'Number needs to be lower than array length';
      var returnedArray = [];
      for (var i=0; i<arr.length; i+=num) {
          returnedArray.push(arr.slice(i,i+num));
      }
      return returnedArray;
    }

    /**
     * Random chance based on number you input, the range is from 1 to 1000.
     * @param {number} number 
     * @returns {boolean}
     */
    static chance(number) {
        if(isNaN(number)) number = 500;
        if(number < 1 && number > 1000) number = 500;
        return Math.random() >= number / 1000 ? true : false;
    };

    /**
     * Pick a random item from an array.
     * @param {array} array 
     */
    static randomEqualArray(array) {
        if(!Array.isArray(array)) return 'Not an Array';
        return array[Math.floor(Math.random() * array.length)];
    };

    /**
     * Pick a random key/value from an object.
     * @param {object} object 
     * @returns {any}
     */
    static randomEqualObject(object) {
        if(object.constructor !== Object) return 'Not an Object';
        return Object.keys(object)[Math.floor(Math.random() * Object.keys(object).length)];
    };

    /**
     * Weighted RNG Array, the heavier the more chance it'll appear.
     * @typedef {number} weight
     * @typedef {[weight, any]} weightedelement
     * @param {weightedelement[]} warray The weighted array.
     * @param {number} runAmount The amount of items to generate.
     */
    static randomWeighted(warray, runAmount) {
        if(!Array.isArray(warray)) return 'Not an Array';
        const totalWeight = warray.reduce((a, [weight]) => a + weight, 0);
        const weightObj = {};
        let weightUsed = 0;
        for (const item of warray) {
          weightUsed += item[0];
          weightObj[weightUsed] = item;
        }
        const keys = Object.keys(weightObj);
        const generate = () => {
          const rand = Math.floor(Math.random() * totalWeight);
          const key = keys.find(key => rand < key);
          return weightObj[key][1];
        };
        const gen = [];
        if(isNaN(runAmount)) runAmount = 10;
        if(runAmount < 1 && runAmount > 1000) runAmount = 10;
        for(var i = 0; i < runAmount; i++) {
            gen.push(generate());
        };
        return gen;
    };

    /**
     * Shortens a string.
     * @param {string} string 
     * @param {number} length 
     * @return {String}
     */
    static shorten(string, length) {
        if(!isNaN(length)) {
        if(string.length > length) {
            string.slice(0, length - 3);
            return `${string}...`;
        }} else return string;
    };

    /**
     * https://stackoverflow.com/a/7228322/10974240
     * @param {number} min 
     * @param {number} max 
     * @returns {Number}
     */
    static randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * Sends a message if it's silent or not.
     * @param {Discord.Message} msg 
     * @param {String} content 
     * @param {Boolean} silent 
     * @param {automsg} automsg 
     * 
     * @typedef {[Boolean, Second]} automsg
     *
     */
    static silentMessage(msg, content, silent, automsg = [null]) {
        if(!silent) {
            if(automsg[0]) {
                return Util.automsg(content, msg, automsg[1]);
            } else return msg.channel.send(content);
        } else return;
    };

    /**
     * Gets a layer of files.
     * @param {String} dirPath 
     * @param {String[]} arrayOfFiles 
     */
    static getLayerOfFiles(dirPath, arrayOfFiles, extension="") {
        dirPath = dirPath.split('/').filter(s=>s.length).join('/');
        var files = fs.readdirSync(dirPath)
       
        arrayOfFiles = arrayOfFiles || []
       
        files.forEach(function(file) {
            if(!file.endsWith(extension) || !fs.statSync(dirPath + "/" + file).isFile()) return;
            if(file.endsWith(".DS_Store")) return;
            arrayOfFiles.push(dirPath + '/' + file)
        })
        return arrayOfFiles;
    };

    /**
     * @param {Array} array 
     * @param {any} value 
     * @returns {number}
     * @static
     */
    static countInArray(array, value) {
        return array.reduce((n, x) => n + (x === value), 0);
    }

    /**
     * Deletes all .DS_Store files.
     * @param {String} dirPath 
     * @param {String[]} arrayOfFiles 
     */
    static deleteAllDSStore(dirPath, arrayOfFiles) {
      dirPath = dirPath.split('/').filter(s=>s.length).join('/');
      var files = fs.readdirSync(dirPath)
     
      arrayOfFiles = arrayOfFiles || []
     
      files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          arrayOfFiles = Util.deleteAllDSStore(dirPath + "/" + file, arrayOfFiles)
        } else {
          if(!file.endsWith(".DS_Store") || !fs.statSync(dirPath + "/" + file).isFile()) return;
          fs.unlinkSync(file)
          arrayOfFiles.push(dirPath + '/' + file)
        }
      })
      return arrayOfFiles;
    }

    /**
     * Gets all files in a folder.
     * @param {String} dirPath 
     * @param {String[]} arrayOfFiles 
     * @param {String} extension
     */
    static getAllFiles(dirPath, arrayOfFiles, extension="") {
        dirPath = dirPath.split('/').filter(s=>s.length).join('/');
        var files = fs.readdirSync(dirPath)
       
        arrayOfFiles = arrayOfFiles || []
       
        files.forEach(function(file) {
          if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = Util.getAllFiles(dirPath + "/" + file, arrayOfFiles, extension)
          } else {
            if(!file.endsWith(extension) || !fs.statSync(dirPath + "/" + file).isFile()) return;
            if(file.endsWith(".DS_Store")) return;
            arrayOfFiles.push(dirPath + '/' + file)
          }
        })
        return arrayOfFiles;
    };

    /**
     * Adds all file sizes to get one large one.
     * @param {String} directory 
     */
    static getCombinedSize(arrayOfFiles) {
        let totalSize = 0

        arrayOfFiles.forEach(function(filePath) {
          totalSize += fs.statSync(filePath).size;
        })
      
        return totalSize;
    }

    /**
     * If variable equals undefined or null.
     * @param {any} variable 
     */
    static isNull(variable) {
        return variable == null;
    };

    /**
     * If variable equals a boolean
     * @param {any} variable 
     */
    static isBoolean(variable) {
        return typeof variable === "boolean";
    };

    /**
     * Escapes any RegExp string.
     * @param {String} string 
     */
    static escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    /**
     * Shorten a string.
     * @param {String} str 
     * @param {Number} max 
     */
    static trim (str, max) {
      return (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
    };
    /**
     * Makes gradients from colors.
     * @param {String} colorStart 
     * @param {String} colorEnd 
     * @param {Number} colorCount 
     */
    static generateColor(colorStart,colorEnd,colorCount){
      function convertToHex (rgb) {
        return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
      }
      function hex (c) {
        var s = "0123456789abcdef";
        var i = parseInt (c);
        if (i == 0 || isNaN (c))
          return "00";
        i = Math.round (Math.min (Math.max (0, i), 255));
        return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
      }
      function convertToRGB (hex) {
        var color = [];
        color[0] = parseInt (((hex.charAt(0) == '#') ? hex.substring(1, 7) : hex).substring (0, 2), 16);
        color[1] = parseInt (((hex.charAt(0) == '#') ? hex.substring(1, 7) : hex).substring (2, 4), 16);
        color[2] = parseInt (((hex.charAt(0) == '#') ? hex.substring(1, 7) : hex).substring (4, 6), 16);
        return color;
      }
      var start = convertToRGB (colorStart);    
      var end = convertToRGB (colorEnd);    
      var length = colorCount;
      var alpha = 0.0;
      var gradient = [];
      for (let i = 0; i < length; i++) {
        var c = [];
        alpha += (1.0/length);
        c[0] = start[0] * alpha + (1 - alpha) * end[0];
        c[1] = start[1] * alpha + (1 - alpha) * end[1];
        c[2] = start[2] * alpha + (1 - alpha) * end[2];
        gradient.push(convertToHex(c));
      }
      return gradient;
    }

    /**
     * Gets a user from message.
     * @param {Discord.Message} message Discord.JS message
     * @param {String[]} args Arguments from command
     * @param {('member'|'user')} type Member or User: Which form do you want the user in?
     * @param {Number} argNum Where is the user part in the message? (Arg. Array index)
     */
    static async userParsePlus(message, args, type, argNum = 0) {
      var guild = message.guild;
      var user;
      if(guild) {
        if(!args[0]) {
          user = message.author;
          if(guild && type.toLowerCase() == "member") {
            return guild.member(user);
          } else return user;
        } else {
          var num=/\d+/i.exec(args.join(' '));
          if(Array.isArray(num)) {
            var id;
            try{
              id=(await message.guild.members.fetch(num[0]));
            } catch {/* Invalid ID */}
            if(id) {user=id.user};
          };
          var arg=(await message.guild.members.fetch({query:args[argNum],limit:1})).first();
          if(arg) {
            user=arg.user;
          };
        };
      };
      if(user) {
      if(guild && type.toLowerCase() == "member") {
        return guild.member(user);
      } else return user;
      } else return null;
    }

    /**
     * Generates a RegEx for handling messages to trigger the bot.
     * @param {Discord.Message} msg
     * @returns {RegExp}
     */
    static generateRegex(msg) {
        if(msg.guild) {
            if(msg.client.getGuildPrefix.get(`${msg.guild.id}`)) {
                prefixes.push(client.getGuildPrefix.get(`${msg.guild.id}`).prefix);
            };
        };
            var newPrefixes = [];
            prefixes.forEach(function(prefix, i){newPrefixes[i] = Util.escapeRegex(prefix)});
            return new RegExp(`^(?<prefix>(${newPrefixes.join('|')}))(?<command>\\w+)\\s?(?<arguments>.*)?`, 'is');
    }

    /**
     * Abbreviate a number
     * @param {Number} number 
     * @param {Number} maxPlaces 
     * @param {Boolena} forcePlaces 
     * @param {'T','B','M','K'} forceLetter 
     */
    static abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
        number = Number(number)
        forceLetter = forceLetter || false
        if(forceLetter !== false) {
          return Util.annotate(number, maxPlaces, forcePlaces, forceLetter)
        }
        var abbr
        if(number >= 1e12) {
          abbr = 'T'
        }
        else if(number >= 1e9) {
          abbr = 'B'
        }
        else if(number >= 1e6) {
          abbr = 'M'
        }
        else if(number >= 1e3) {
          abbr = 'K'
        }
        else {
          abbr = ''
        }
        return Util.annotate(number, maxPlaces, forcePlaces, abbr)
      }
      
    /**
     * @param {Number} number 
     * @param {Number} maxPlaces 
     * @param {Boolean} forcePlaces 
     * @param {String} abbr 
     * @private
     */
    static annotate(number, maxPlaces, forcePlaces, abbr) {

        var rounded = 0
        switch(abbr) {
          case 'T':
            rounded = number / 1e12
            break
          case 'B':
            rounded = number / 1e9
            break
          case 'M':
            rounded = number / 1e6
            break
          case 'K':
            rounded = number / 1e3
            break
          case '':
            rounded = number
            break
        }
        if(maxPlaces !== false) {
          var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
          if(test.test(('' + rounded))) {
            rounded = rounded.toFixed(maxPlaces)
          }
        }
        if(forcePlaces !== false) {
          rounded = Number(rounded).toFixed(forcePlaces)
        }
        return rounded + abbr
    }
};
module.exports = Util;