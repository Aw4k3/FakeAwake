const Discord = require("discord.js");

function Run(message, args, args_with_case, client) {
    message.channel.send({ files: [new Discord.MessageAttachment("Assets/Images/Doomfish.png")] });

    return true;
}

module.exports = {
    NSFW: false,
    name: "doomfish",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "doomfish" ],
        [ "df" ]
    ],
    Run
}