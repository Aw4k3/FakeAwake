const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Random = require("../../include/random");

const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

function Run(message, args, args_with_case, client) {
    if (args[1] && args[2]) {
        var lower = parseInt(args[1]),
            upper = parseInt(args[2]),
            result = Random.RandInt(lower, upper + 1);

        switch (args[3]) {
            default:
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Generate Random Number")
                            .setColor(Status.StatusColor("OK"))
                            .setDescription(result.toString())
                            .setFooter("Integer")
                    ]
                });
                break;

            case "-f":
                lower = parseFloat(args[1]);
                upper = parseFloat(args[2]);
                result = Random.RandFloat(lower, upper + 1.0);
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Generate Random Number")
                            .setColor(Status.StatusColor("OK"))
                            .setDescription(result.toString())
                            .setFooter("Float")
                    ]
                });
                break;

            case "-bin":
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Generate Random Number")
                            .setColor(Status.StatusColor("OK"))
                            .setDescription(result.toString(2))
                            .setFooter("Binary")
                    ]
                });
                break;

            case "-hex":
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Generate Random Number")
                            .setColor(Status.StatusColor("OK"))
                            .setDescription(result.toString(16))
                            .setFooter("Hexadecimal")
                    ]
                });
                break;
        }
    } else if (args[1]) {
        switch (args[1]) {
            case "-date":
            case "-ddmm":
            case "-dm":
                {
                    let DateResult = new Date(new Date(0, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(0, 0, 1).getTime()));
                    message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setTitle("Generate Random Number")
                                .setColor(Status.StatusColor("OK"))
                                .setDescription(`${DateResult.getDate()} ${Months[DateResult.getMonth()]}`)
                                .setFooter("Date | DD-MM-YYYY is superior :)")
                        ]
                    });
                }
                break;

            case "-dateandyear":
            case "-datewithyear":
            case "-ddmmyyyy":
            case "-dmy":
                {
                    let DateResult = new Date(new Date(0, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(0, 0, 1).getTime()));
                    message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setTitle("Generate Random Number")
                                .setColor(Status.StatusColor("OK"))
                                .setDescription(`${DateResult.getDate()} ${Months[DateResult.getMonth()]} ${DateResult.getFullYear()}`)
                                .setFooter("Date | DD-MM-YYYY is superior :)")
                        ]
                    });
                }
                break;
        }
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Generate Random Int")
                    .setColor(Status.StatusColor("ERROR"))
                    .addFields(
                        { name: "Bracket Definitions", value: "{Required} [optional]" },
                        { name: "randnum {min} {max} [-f | -bin | -hex]", value: "Returns a random number between the given range. Inclusive." }
                    )
                    .setFooter(Status.InvalidCommandMessage())
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "randnum",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "rand" ],
        [ "random" ],
        [ "randnum" ]
    ],
    Run
}