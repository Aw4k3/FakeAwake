const Random = require('../../include/Random.js');

function Run(channel, tags, msg, self, client, args, args_with_case = []) {
    var Entries = []
    var Upper = 101;
    var resolved = [];
    var user = tags.username;

    if (msg.includes('-overload')) {
        Upper = Number.MAX_SAFE_INTEGER;
        msg.replace('-overload', '');

        if (args_with_case.indexOf(args_with_case) > -1) args_with_case.splice(args_with_case.indexOf(args_with_case), 1);
    }

    args_with_case[0] = args_with_case[0].substring(3);

    for (var i = 0; i < args_with_case.length; i++)
        if (args_with_case[i].startsWith("@")) user = args_with_case[i]; else resolved.push(args_with_case[i]);

    client.say(channel, `${user} is ${Random.RandInt(0, Upper)}% ${resolved.join(" ")}`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "howx",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["howx"]
    ],
    Run
}