const Discord = require("discord.js");

function Run(message, args, args_with_case, client) {
    message.channel.send({ files: [new Discord.MessageAttachment("Assets/Gifs/oculustrash.gif")] });

    return true;
}

module.exports = {
    NSFW: false,
    name: "oculus",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
         [ "oculus" ]
    ],
    Run
}