const Random = require('../../include/Random.js');

function Run(channel, tags, msg, self, client, args, args_with_case) {
    var UpperLimit = 101,
        StringResult = msg.replace('!hate ', '');
    if (args.length > 1) {
        if (msg.includes('-overload')) {
            UpperLimit = Number.MAX_SAFE_INTEGER;
            StringResult = StringResult.replace('-overload', '').trim();
        }

        client.say(channel, `@${tags.username} hates ${StringResult} [${Random.RandInt(0, UpperLimit)}% hate!]`);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "hate",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["hate"]
    ],
    Run
}