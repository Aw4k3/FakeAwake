const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Random = require("../../include/Random.js");

const ICON = new Discord.MessageAttachment("./Assets/Images/awakeGasm.png")

function Run(message, args, args_with_case, client) {
    var Entries = [];
    var Upper = 101;

    if (message.content.includes("-overload")) {
        Upper = Number.MAX_SAFE_INTEGER;
    }

    message.mentions.members.forEach(user => {
        Entries.push(`${user}: ${Random.RandInt(0, Upper)}% PP Rating`);
    });

    if (message.mentions.members.size) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("PP Rater")
                    .setColor("#ff0000")
                    .setThumbnail("attachment://awakeGasm.png")
                    .setDescription(Entries.join("\n"))
            ],
            files: [
                ICON
            ]
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("PP Rater")
                    .setColor("#ff0000")
                    .setThumbnail("attachment://awakeGasm.png")
                    .setDescription(`${message.author.toString()}: ${Random.RandInt(0, Upper)}% PP Rating`)
            ],
            files: [
                ICON
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "ratemypp",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "ratemypp" ],
        [ "rmpp" ]
    ],
    Run
}