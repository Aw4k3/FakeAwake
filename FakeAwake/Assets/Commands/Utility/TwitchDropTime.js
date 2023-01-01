const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    if (args[1]) {
        var percent = (parseFloat(args[1]) || 0) / 100;
        var elapsed = percent * 240;
        message.channel.send([
            `Started at: <t:${Math.floor((Date.now() / 1000) - (elapsed * 60))}:t> (<t:${Math.floor((Date.now() / 1000) - (elapsed * 60))}:R>)`,
            `Ready at: <t:${Math.floor((Date.now() / 1000) + ((240 - elapsed) * 60))}:t> (<t:${Math.floor((Date.now() / 1000) + ((240 - elapsed) * 60))}:R>)`
        ].join("\n"));
    } else {
        message.channel.send("Usage: .droptime `current percent`");
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "twitchdroptime",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "droptime" ]
    ],
    Run
}