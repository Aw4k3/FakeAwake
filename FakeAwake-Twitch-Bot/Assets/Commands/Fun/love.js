const Random = require('../../include/Random.js');

function Run(channel, tags, msg, self, client, args, args_with_case) {
    var UpperLimit = 101,
        StringResult = msg.replace('!love ', '');
    if (args.length > 1) {
        if (msg.includes('-overload')) {
            UpperLimit = Number.MAX_SAFE_INTEGER;
            StringResult = StringResult.replace('-overload', '').trim();
        }

        client.say(channel, `@${tags.username} loves ${StringResult} [${Random.RandInt(0, UpperLimit)}% love!]`);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "love",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["love"]
    ],
    Run
}