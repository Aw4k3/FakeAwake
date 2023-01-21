const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    message.reply(`${message.author}, Woof Woof Motherfucker! :)`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "bark",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "bark" ]
    ],
    Run
}