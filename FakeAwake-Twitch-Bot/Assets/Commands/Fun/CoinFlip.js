const Random = require('../../include/Random');

function Run(channel, tags, msg, self, client, args, args_with_case) {
    if (Random.RandBool()) {
        client.say(channel, `Heads!`)
    } else {
        client.say(channel, `Tails!`)
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "coinflip",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["coinflip"],
        ["cf"]
    ],
    Run
}