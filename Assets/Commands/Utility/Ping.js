const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    message.channel.send({
        embeds: [
            new Discord.MessageEmbed()
                .addField("Waiting for response", "Waiting for response")
        ]
    }).then(message => {
        var BotLatency = message.createdTimestamp - message.createdTimestamp;
        message.edit({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Pong!")
                    .setColor(Status.StatusColor("OK"))
                    .setDescription(`**Bot Latency:** ${BotLatency}ms\n**API Latency:** ${client.ws.ping}ms`)
                    .setFooter("Pong!")
            ]
        })
    });

    return true;
}

module.exports = {
    NSFW: false,
    name: "ping",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "ping" ]
    ],
    Run
}