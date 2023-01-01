const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    if (message.mentions.users.size) {
        message.mentions.users.forEach(user => {
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("Mug Shot Taken")
                        .setColor(Status.StatusColor("OK"))
                        .setDescription("You're looking absolutely glamorous today.")
                        .setThumbnail("https://c.tenor.com/2pBlO6CW1xEAAAAC/caught-4k.gif")
                        .setImage(user.avatarURL({ size: 512 }))
                ]
            });
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Mug Shot Taken")
                    .setColor(Status.StatusColor("OK"))
                    .setDescription("You're looking absolutely glamorous today.")
                    .setThumbnail("https://c.tenor.com/2pBlO6CW1xEAAAAC/caught-4k.gif")
                    .setImage(message.author.avatarURL({ size: 512 }))
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "profilepic",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "mugshot" ],
        [ "pfp" ]
    ],
    Run
}