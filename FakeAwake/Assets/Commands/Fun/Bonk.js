const Discord = require("discord.js");
const FileSystem = require("fs");
const Random = require("../../include/Random.js");
const UserStats = require("../../include/userStatsLogger");

const BonkImages = FileSystem.readdirSync("./Assets/Gifs/Bonk");

function Run(message, args, args_with_case, client) {
    var idx = Random.RandInt(0, BonkImages.length);
    var bonk_image = new Discord.MessageAttachment(`./Assets/Gifs/Bonk/${BonkImages[idx]}`)
    if (message.mentions.users.size) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Bonk")
                    .setThumbnail(`attachment://${BonkImages[idx]}`)
                    .addField("Bonked", Array.from(message.mentions.users.values()).join("\n"))
                    .setFooter(`Bonked by ${message.author.tag}`, message.author.avatarURL())
            ],
            files: [
                bonk_image
            ]
        });
        message.mentions.users.forEach(user => {
            UserStats.LogUserStat(message.author, "BonksGiven", user);
            UserStats.LogUserStat(user, "BonksReceived", message.author);
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Bonk")
                    .setThumbnail(`attachment://${BonkImages[idx]}`)
                    .addField("Bonked", message.author.toString())
                    .setFooter(`Bonked by ${message.author.tag}`, message.author.avatarURL())
            ],
            files: [
                bonk_image
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "bonk",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "bonk" ]
    ],
    Run
}