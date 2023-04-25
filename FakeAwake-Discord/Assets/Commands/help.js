const CommandHandler = require("../include/CommandHandler.js");

function Run(message, args, args_with_case, client) {
    message.channel.send({ embeds: [CommandHandler.GetHelpMenu()]});
    return true;
}

module.exports = {
    NSFW: false,
    name: "help",
    aliases: [
        [ "help" ]
    ],
    Run
}