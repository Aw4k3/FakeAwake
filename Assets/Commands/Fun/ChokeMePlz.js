const Discord = require("discord.js");
const Status = require("../../include/Status.js");

const ICON = new Discord.MessageAttachment("./Assets/Images/chokeme.png");

function Run(message, args, args_with_case, client) {
    if (message.mentions.users.size) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("ChokeMePlz")
                    .setThumbnail("attachment://chokeme.png")
                    .setDescription(Array.from(message.mentions.users.values()).join("\n"))
                    .setFooter(`Calling these people to choke you!`)
            ],
            files: [
                ICON
            ]
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("ChokeMePlz")
                    .setThumbnail("attachment://chokeme.png")
                    .setColor(Status.StatusColor("OK"))
                    .setDescription(`${message.author.toString()} was choked!`)
            ],
            files: [
                ICON
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: true,
    name: "chokeMePlz",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "chokemepls" ],
        [ "chokemeplease" ],
        [ "chokemeplz" ]
    ],
    Run
}