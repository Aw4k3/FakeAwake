const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Utils = require("../../include/Utils.js");

function Run(message, args, args_with_case, client) {
    if (message.author.id === "301985885870882827") try { eval(message.content.substring(7)); } catch (e) { console.log(e); }

    return true;
}

module.exports = {
    NSFW: false,
    name: "script",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        ["script"]
    ],
    Run
}