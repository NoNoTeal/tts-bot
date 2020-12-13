const { prefixes } = require('./../config.json');
module.exports = bot => {

setInterval(() => {
    if(!bot.path.util.maintenance) {
    var randomprefix = prefixes[Math.floor(Math.random() * prefixes.length)]

    var presences = [
        `for prefix: ${randomprefix} & Use ${randomprefix}help`,
    ]

    bot.user.setPresence({
        activity: {
            application: {id: bot.user.id},
            type: 3,
            name: presences[Math.floor(Math.random() * presences.length)],
            url: 'https://github.com/nonoteal/',
        },
        status: "online",
    })
    } else {
        bot.user.setPresence({
            activity: {
                application: {id: bot.user.id},
                name: "🛠️ Maintenance mode.",
                type: 3,
                url: 'https://github.com/nonoteal',
            },
            status: "dnd",
        });
    }
}, 10000);

}
