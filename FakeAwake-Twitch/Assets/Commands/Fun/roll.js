const Random = require('../../include/Random.js');

function Run(channel, tags, msg, self, client, args, args_with_case) {
    var Upper = parseInt(args[1]) || 100;
    client.say(channel, `@${tags.username} you rolled a ${Random.RandInt(0, Upper + 1)}!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "roll",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["roll"]
    ],
    Run
}