const Discord = require('discord.js');
const https = require('https');
const Util = require('../../util/essentials/Util');
const passingColors = Util.generateColor('#03ce00', '#007a34', 100);
const failingColors = Util.generateColor('#ce0000', '#b00000', 100);
const maybeColors = Util.generateColor('#ab4b00', '#e6e82f', 100);
function asUUID(uuid) {
    if (uuid.length <= 16) {
        return "steve";
      } else {
        var even = parseInt(uuid[ 7], 16) ^ parseInt(uuid[15], 16) ^ parseInt(uuid[23], 16) ^ parseInt(uuid[31], 16);
        return even ? "alex" : "steve";
      }
}    
function getKeyByValue(object, value) {
    //https://stackoverflow.com/a/28191966/10974240
    return Object.keys(object).find(key => object[key] === value);
}
function minuteToTime(duration) {
    var minutes = Math.floor(duration % 60),
    hours =  Math.floor((duration / 60) % 24),
    days = Math.floor((duration / 60) / 24);      

    var filtered = [days ? `\`${days}\` ${days > 1 ? 'Days' : 'Day'}` : ``,hours ? `\`${hours}\` ${hours > 1 ? 'Hours' : 'Hour'}` : ``,minutes ? `\`${minutes}\` ${minutes > 1 ? 'Minutes' : 'Minute'}` : ''].filter(n => n.length);
  
    return filtered.length ? filtered.join(', ') : 'N/A';
}
module.exports.check = function(message, ign, obj, failed='Failed the Background Check.', passed='Passed the Background Check.', limitDetails=false, doNameHistory=false) {
    try{
    delete require.cache[require.resolve('./mark.json')];
    var mark = require('./mark.json');
    delete require.cache[require.resolve('./whitelist.json')];
    var whitelist = require('./whitelist.json');
    var fail = mark.includes(ign.toLowerCase());
    var embed = new Discord.MessageEmbed();
    var pass = whitelist.includes(ign.toLowerCase());
    if(fail) {
        embed.setAuthor(`🚨 Is on the 'Mark' list 🚨`);
    }
    if(pass) {
        if(fail) {
            pass = false;
        }
    }
    if(!obj) {
        try{
        delete require.cache[require.resolve('./servers.js')];
        const {blacklisted} = require('./servers.js');
        obj=blacklisted;
        } catch {
            return message.channel.send('`JSON` file is being edited or doesn\'t exist. Please try again later.')
        }
    }
    var blackkeys = Object.values(obj);
    if(!blackkeys.length) return message.channel.send('No servers to check. Add some!')
    if(![].concat.apply([], blackkeys).every(id => typeof id === 'number')) return message.channel.send('All IDs must be strictly numbers. Edit `servers.js`')
    var progressMsg,
        encodedData,
        skinURL,
        model,
        capeURL;
    (async function() {
        progressMsg = await message.channel.send(`Please wait...`);
    })()
        if(!ign.length) return;
        var nameAndID = '',
            pastNames = [];
    rqNameAndUUID();
    function rqNameAndUUID(attempts=0) {
        var check = https.get(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(ign)}?at=${Date.now()}`, {headers: {"User-Agent": `tts-bot-${Math.random().toString(2, 16).substr(0,2)}`}},
         r => {
            var data = '';
            r.on('data', (d) => {
                data+=d;
            })
            r.on('close', () => {
                try {
                    progressMsg.edit('Fetching UUID').catch(e => {});
                } catch {};
                try{
                    if(r.statusCode == 204) {
                        return initiateAfterUUIDParse();
                    }
                    nameAndID = JSON.parse(data);
                    ign = nameAndID.name;
                    model = asUUID(nameAndID.id);
                    if(nameAndID.errorMessage) {
                        if(nameAndID.errorMessage.endsWith('is invalid')) {
                            return message.channel.send('Name is invalid.')
                        }
                    }
                    getSkins();
                        var namemcembed = new Discord.MessageEmbed()
                        .setColor([0,0,0])
                        .setTimestamp()
                        .setTitle(`Check NameMC History?`)
                        .setThumbnail('https://static.namemc.com/i/favicon-30.png')
                        .setDescription(`Check for **\`${ign}\`**'s NameMC History?`)
                        .setURL(`https://namemc.com/profile/${ign}`);
                    setTimeout(() => {
                        message.channel.send(namemcembed);
                    }, 10000);
                }catch {
                    nameAndID = {};
                    if(attempts < 3) {
                        rqNameAndUUID(attempts++);
                    } else if(!nameAndID.name) {
                        message.channel.send(`Failed to fetch Mojang data. User may be cracked.`);
                        return initiateAfterUUIDParse();
                    };
                }
            })
        })
        check.on('error', () => {
            if(attempts < 3) {
                rqNameAndUUID(attempts++);
            } else {
                message.channel.send(`An \`HTTPS\` related error occurred. \`Failed @ Mojang Name Check\`. Moving on.`);
                return initiateAfterUUIDParse();
            }
        });
    }
        function getSkins(attempts=0) {
            var skins = https.get(`https://sessionserver.mojang.com/session/minecraft/profile/${encodeURIComponent(nameAndID.id)}`, {headers: {"User-Agent": `tts-bot-${Math.random().toString(2, 16).substr(0,2)}`}},
            r => {
               var data = '';
               r.on('data', (d) => {
                   data+=d;
               })
               r.on('close', () => {
                    try{
                        progressMsg.edit('Fetching textures').catch(e => {});;
                    } catch{}
                   try{
                       encodedData = JSON.parse(data);
                       encodedData = JSON.parse(Buffer.from(encodedData.properties[0].value, 'base64').toString());
                       skinURL = encodedData.textures["SKIN"]; 
                       capeURL = encodedData.textures["CAPE"];
                       doUUids();
                   }catch{
                    if(attempts < 3) {
                        getSkins(attempts++);
                    } else {
                        progressMsg.edit('Something went wrong getting the textures!').catch(e => {});
                        doUUids();
                    };
                   }
               })
           })
           skins.on('error', () => {
            if(attempts < 3) {
                getSkins(attempts++);
            } else {
                message.channel.send('An \`HTTPS\` related error occurred while getting the skins. Moving on.');
                doUUids();
            };
           });
        }
        function doUUids(attempts=0) {
        if(doNameHistory) {
        var pastName = https.get(`https://api.mojang.com/user/profiles/${encodeURIComponent(nameAndID.id)}/names`, {headers: {"User-Agent": `tts-bot-${Math.random().toString(2, 16).substr(0,2)}`}},
        r => {
           var data = '';
           r.on('data', (d) => {
               data+=d;
           })
           r.on('close', () => {
               try{
                    progressMsg.edit('Fetching name history...').catch(e => {});
               } catch{}
               try{
                   pastNames=JSON.parse(data).map(e => e.name);
                   if(doNameHistory) {
                    var historyName = new Discord.MessageEmbed()
                    .setColor('#960000')
                    .setTimestamp()
                    .setTitle(`Name History`)
                    .setDescription(Util.trim(`\`${pastNames.join('`, `')}\``, 2048))
                    setTimeout(() => {
                    message.channel.send(historyName);
                    }, 5000);}
               }catch{
                   pastNames = [];
                   if(attempts < 3) {
                        doUUids(attempts++);
                    } else {
                        message.channel.send('Failed to get the name history. Moving on.');
                        initiateAfterUUIDParse();
                    };
               }
           })
        })
        pastName.on('error', () => {
        if(attempts < 3) {
            doUUids(attempts++);
        } else {
            message.channel.send('An \`HTTPS\` related error occurred while getting the name history. Moving on.');
            initiateAfterUUIDParse();
        };
        });
        } else initiateAfterUUIDParse();}
        function initiateAfterUUIDParse() {
        var servers = [],
            descriptions = [],
            c = 1,
            serverCount = 0,
            embedsent = false,
            fails = 0,
            uuid = nameAndID.id || 'N/A',
            serverLength = [].concat.apply([], blackkeys).length,
            time = 0,
            link = `https://minecraft-statistic.net/api/player/info/${ign}`,
            f = https.get({
        hostname: 'minecraft-statistic.net',
        path: `/api/player/info/${ign}`,
        headers: {"User-Agent": "tts-bot-" + Math.random().toString(2).substr(2, 16)}}, (response) => {
            var dta = '';
            response.on('data', (d) => {
                dta+=d;
            });
            response.on('end', () => {
                try{
                    progressMsg.edit('Fetching Statistic Sample...').catch(e => {});
                }catch{};
                try{
                    dta = JSON.parse(dta);
                    } catch {
                        return message.channel.send('Error Parsing JSON. Check manually?: ' + link + ' \`Failed @ Name Check\`')
                    }
                if(!dta.data) {
                    progressMsg.delete().catch(c => {});
                    embed.setTitle(`${ign} ${fail ? failed :`Was Not Found.`}`)
                    .setDescription('*This Player Is Not Being Monitored.*')
                    .setColor(fail ? failingColors[Math.floor(Math.random() * failingColors.length)] : maybeColors[Math.floor(Math.random() * maybeColors.length)])
                    .setFooter('Name has to be CaSe sEnSiTiVe!')
                    .setTimestamp()
                    return message.channel.send(embed);
                } else
        function generateEmbed() {
            if(c === serverLength) {
                servers = servers.filter(s => s.data.visited_server == true);
            if(servers.length) {
                    if(embedsent) return;
                    progressMsg.delete().catch(c => {});
                    embedsent = true;
                    var mainMessage = Util.trim(`*This Player was found on the following server${servers.length > 1 ? 's' : ''}:*\n${descriptions.map(d => `• **${d.server}** *(ID${d.ids.length > 1 ? `s` : ``}: ${d.ids.join(', ')})* for ${minuteToTime(d.time)}`).join('\n')}\n`, 2048);
                    var limitedMessage = Util.trim(`This player is found on: ${descriptions.map(d => `**\`${d.server}\`**`).join(', ')}`, 2048);
                    embed.setTitle(`${ign} ${failed}`)
                    .addField(`\u200B`, `Think there's more? Check [here](https://minecraft-statistic.net/en/player/${ign}.html).`)
                    .setDescription(limitDetails ? limitedMessage : mainMessage)
                    .setColor(failingColors[Math.floor(Math.random() * failingColors.length)])
                    .addField('**Total Play Time** *(Not accurate)*', minuteToTime(time))
                    .addField('**Servers Triggered**', `\`${serverCount}/${serverLength}\`or \`${Math.round((serverCount/serverLength) * 100)}%\``)
                    .setFooter(`UUID: ${uuid}`)
                    .setTimestamp()
                    skinURL ? embed.addField(`**Skin**`, skinURL.url) : '';
                    capeURL ? embed.addField(`**Cape**`, capeURL.url) : '';
                    model ? embed.addField(`**Model**`, model) : '';
                    fails > 0 ? embed.addField('**Network Errors**', `Couldn't get data for \`${fails}/${serverLength}\` server(s). Please retry.`) : '';
                    return message.channel.send(embed);
                } else {
                    if(embedsent) return;
                    progressMsg.delete().catch(e => {});
                    embedsent = true;
                    embed.setTitle(`${ign} ${fail ? failed : passed}`)
                    .addField(`\u200B`, `Wanna see for yourself? Check [here](https://minecraft-statistic.net/en/player/${ign}.html).`)
                    .setDescription('*This Player was not found on the server list' + `${fail ? `, but was found on the mark list.` : ``}` + '.*')
                    .setColor(fail ? failingColors[Math.floor(Math.random() * failingColors.length)] : passingColors[Math.floor(Math.random() * passingColors.length)])
                    .setTimestamp()
                    .setFooter(`UUID: ${uuid}`)
                    skinURL ? embed.addField(`**Skin**`, skinURL.url) : '';
                    capeURL ? embed.addField(`**Cape**`, capeURL.url) : '';
                    model ? embed.addField(`**Model**`, model) : '';
                    fails > 0 ? embed.addField('**Network Errors**', `Couldn't get data for \`${fails}/${serverLength}\` server(s). Please retry.`) : '';
                    return message.channel.send(embed);
                }
            } else c++;
        }
        function checkUser(badserver, serverName, failed=0) {
            var s = https.get({
                hostname: 'minecraft-statistic.net', 
                path: `/api/player/info/${ign}/${badserver}`,
                headers: {"User-Agent": "tts-bot-" + Math.random().toString(2).substr(2, 16)}}, (r) => {
                    var str = '';
                    r.on('data', (d) => {
                        str+=d;
                    });
                    r.on('end', () => {
                        try{
                            str = JSON.parse(str);
                            } catch {
                                return message.channel.send('Error Parsing JSON. Check manually?: ' + link)
                        }
                        if((c/serverLength) > .90) {
                            if(!progressMsg.content.includes('90')) {
                                progressMsg.edit('Checking Servers. \`90%\` done.')
                            }
                        } else if((c/serverLength) > .75) {
                            if(!progressMsg.content.includes('75')) {
                                progressMsg.edit('Checking Servers. \`75%\` done.')
                            }
                        } else if((c/serverLength) > .5) {
                            if(!progressMsg.content.includes('50')) {
                                progressMsg.edit('Checking Servers. \`50%\` done.')
                            }
                        } else if((c/serverLength) > .25) {
                            if(!progressMsg.content.includes('25')) {
                                progressMsg.edit('Checking Servers. \`25%\` done.')
                            }
                        }  
                        if(str.data) {
                        if(str.data.visited_server === true) {
                            if(descriptions.findIndex(o => o.server == serverName) > -1) {
                                var serverEntry = descriptions[descriptions.findIndex(o => o.server == serverName)];
                                serverEntry.ids.push(badserver);
                                serverEntry.time = parseFloat(serverEntry.time) + parseFloat(str.data.total_time_play);
                            } else {
                                descriptions.push({server: serverName, ids: [badserver], time: str.data.total_time_play});
                            }
                            time = time + parseInt(str.data.total_time_play);
                            serverCount++;
                        }
                        servers.push(str);
                        generateEmbed();
                        }
                    })
                })
                s.on('error', () => {
                    if(failed > 2) {
                        fails++;generateEmbed();
                    } else {
                        checkUser(badserver, serverName, failed++)
                    }
                });
        }
        if(pass) {
            c = serverLength;
            generateEmbed();
            progressMsg.edit(`Checking Servers process OVERRIDDEN! User was on pass list!`).catch(e => {});
        } else {
            progressMsg.edit(`Checking Servers. (This may take a while!)`).catch(e => {});
        var promised = [];
        blackkeys.forEach((badserver) => {
            if(!Array.isArray(badserver)) {
                promised.push({s: badserver, n: getKeyByValue(obj, badserver), l: promised.length*200});
            } else {
                for(var serverID of badserver) {
                    promised.push({s: serverID, n: getKeyByValue(obj, badserver), l: promised.length*200});
                }
            }
        });//badservers.forEach().

        promised = Util.chunk(promised, 5)
        for (const promisedChunk of promised) {
            Promise.all(promisedChunk.map(c => setTimeout(() => {checkUser(c['s'], c['n'])}, c['l'])))
        }

        //checkUser(badserver, getKeyByValue(obj, badserver));

        }; //end for if(pass) {...} else {...} code block.
        });//response end to check if the user exists.
        });//https request to check for user.
        f.on('error', () => {
            return message.channel.send('An \`HTTPS\` related error occurred. Check manually: ' + `https://minecraft-statistic.net/en/player/${ign}.html`+ ' \`Failed @ Name Check\`');
        });
    }} catch (e) {
        console.log(e)
        message.channel.send('An internal error occurred. JSON might be being edited... Try again later.');
    } finally {
    }
};