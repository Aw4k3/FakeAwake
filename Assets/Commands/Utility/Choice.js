const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Random = require("../../include/Random.js");

function Run(message, args, args_with_case, client) {
    var entities = message.content.replace(".choice ", "").split(",");

    if (entities.length > 0) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Choice")
                    .setColor(Status.StatusColor("OK"))
                    .addFields(
                        { name: "Entites", value: entities.join("\n") },
                        { name: "Choice", value: entities[Random.RandInt(0, entities.length)] }
                    )
                    .setFooter("I make desicions for you since you can't decide for yourself")
            ]
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Usage")
                    .setColor(Status.StatusColor("ERROR"))
                    .addFields(
                        { name: "Bracket Definitions", value: "{Required} [optional]" },
                        { name: "choice {comma seperated list]", value: "Picks a random item from a given list." }
                    )
                    .setFooter(Status.InvalidCommandMessage())
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "choice",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "choice" ]
    ],
    Run
}