const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Random = require("../../include/Random.js");

const ICON = new Discord.MessageAttachment("./Assets/Images/hateIcon.png");

function Run(message, args, args_with_case, client) {
    args.shift();

    var UpperLimit = 101;
    var StringResult = args.join(" ");
    if (args.length) {
        if (message.content.includes("-overload")) {
            UpperLimit = Number.MAX_SAFE_INTEGER;
            StringResult = StringResult.replace("-overload", "").trim();
        }

        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Hateometer")
                    .setColor("#5e6d61")
                    .setThumbnail("attachment://hateIcon.png")
                    .setDescription(`${message.author.toString()} x ${StringResult}\n**${Random.RandInt(0, UpperLimit)}% hate**`)
                    .setFooter("*Death Stare*")
            ],
            files: [
                ICON
            ]
        });
    } else {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle("Usage")
            .setColor(Status.StatusColor("ERROR"))
            .addFields(
                { name: "Bracket Definitions", value: "{Required} [optional]" },
                { name: "hate [flags] {Subject}", value: "Returns how much you hate something or someone." },
                { name: "Available Flags", value: "-overload" }
            )
            .setFooter(Status.InvalidCommandMessage())
        );
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "hate",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "hate" ]
    ],
    Run
}