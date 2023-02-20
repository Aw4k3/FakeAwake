const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    var entries = [
        `**Name:** ${message.guild.name}`,
        `**Channel Count:** ${message.guild.channels.cache.size}`,
        `**Member Count:** ${message.guild.memberCount}`,
        `**Server Owner:** <@${message.guild.ownerId}>`,
        `**Boost Count:** ${message.guild.premiumSubscriptionCount}`,
        `**Server Birth Date:** ${message.guild.createdAt}`,
        `**Server Roles:** ${Array.from(message.guild.roles.cache.values()).toString()}`
    ]

    message.channel.send({
        embeds: [
            new Discord.MessageEmbed()
                .setTitle("Stalking this server's infos")
                .setDescription(entries.join("\n"))
                .setThumbnail(message.guild.iconURL())
        ]
    });

    return true;
}

module.exports = {
    NSFW: false,
    name: "serverinfo",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "here" ],
        [ "serverinfo" ],
        [ "this" ]
    ],
    Run
}