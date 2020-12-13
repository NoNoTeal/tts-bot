const fs = require('fs');
const bs3 = require('better-sqlite3');
const { getAllFiles } = require('./../essentials/Util');
const { basename } = require('path');

module.exports = () => {
    console.log(`SQLITE3 Management is turned on. Turn off under ./src/util/config.json`);
    setInterval(() => {
        console.log('---------sqliteManager.js is Purging Cooldowns---------');
        if(!fs.existsSync(`./src/util/essentials/util-cache/Cooldowns.sqlite`)) return console.log(`sqliteManager.js - Backup cancelled! ./src/util/essentials/util-cache/Cooldowns.sqlite doesn't exist!`);
        const Cooldowns = bs3(`./src/util/essentials/util-cache/Cooldowns.sqlite`);
        const CooldownsTable = Cooldowns.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'cooldown';").get();
        if(!CooldownsTable['count(*)']) return;
        const CooldownsDelete = Cooldowns.prepare("DELETE FROM cooldown WHERE id = ?");
        var CooldownArray = [...Cooldowns.prepare("SELECT * FROM cooldown").iterate()]
        console.log(`sqliteManager.js - ${CooldownArray.length} object(s) reviewed`);
        var initalLength = CooldownArray.length;
        var purged = 0;
        CooldownArray = CooldownArray.filter(function(cooldown) {
            if(Date.now() > cooldown.timestamp) {
                CooldownsDelete.run(cooldown.id);
                purged++;
                return true;
            } else return false;
        });
        console.log(`sqliteManager.js - ${initalLength - purged} object(s) remaining`);
        console.log('---------sqliteManager.js Finished Purging Cooldowns---------');
    }, 60000);
    setInterval(() => {
        console.log('---------sqliteManager.js is Backing up utility files---------');
        if(!fs.existsSync(`./src/util/essentials/util-cache/`)) return console.log(`sqliteManager.js - Backup cancelled! ./src/util/essentials/util-cache/ doesn't exist!`);

        fs.mkdirSync(`./src/util/essentials/util-cache/sqlite-backup`, { recursive: true });
        for(var fileDir of getAllFiles(`./src/util/essentials/util-cache`, null, `.sqlite`)) {
            if(fs.existsSync(fileDir)) {
            const name = basename(fileDir, '.sqlite');
            console.log(`sqliteManager.js - Attempting to create a backup for ${name}.sqlite`);
            const Cooldowns = bs3(fileDir);
            try{
            Cooldowns.backup(`./src/util/essentials/util-cache/sqlite-backup/${name}-${new Date()}.sqlite`);
            } catch (e) {console.log(e); console.log(`Error occurred while trying to create a backup for ${name}.sqlite`)};
            console.log(`sqliteManager.js - ${name}.sqlite's backup was successfully created.`);
            };
        };
        console.log('---------sqliteManager.js Finished Backing up utility files---------');
    }, 3.6e+6);
};