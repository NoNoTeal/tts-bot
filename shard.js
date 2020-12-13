const { ShardingManager } = require('discord.js')
const { token } = require('./src/xteal/util/config.json')
const shards = new ShardingManager('./main.js', { token: token, totalShards: 1})

shards.spawn("auto");
shards.on('shardCreate', shard => {console.log('New shard: ' + shard.id)})