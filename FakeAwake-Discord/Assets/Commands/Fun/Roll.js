const Random = require("../../include/Random.js");

function Run(message, args, args_with_case, client) {
    var Upper = parseInt(args[1]) || 100;
    message.channel.send(`${message.author} you rolled a ${Random.RandInt(0, Upper + 1)}`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "roll",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "roll" ]
    ],
    Run
}