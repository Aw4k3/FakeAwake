const Discord = require("discord.js");
const FileSystem = require("fs");
const Status = require("../../include/Status.js");
const Banking = require("../../include/Banking.js");

const ICON = new Discord.MessageAttachment("./Assets/Images/OnePoundCoin.png");

function Run(message, args, args_with_case, client) {
    if (args.length > 2) {
        // Create Entry for all given and accepted currencys
        for (var i = 2; i < args.length; i++) {
            if (Banking.Currencys.includes(args[i])) {
                Banking.VerifyUser(message.author, args[i]);

                // Creation Successful (as long as I didn"t fuck up the code)
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("FakeAwake Banking")
                            .setColor(Status.StatusColor("OK"))
                            .setThumbnail("attachment://OnePoundCoin.png")
                            .setDescription(`${message.author}\nAccount successfully opened for ${args[i]}!`)
                            .setFooter("Account Creation")
                    ],
                    files: [
                        ICON
                    ]
                });
            } else {
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Usage")
                            .setColor(Status.StatusColor("ERROR"))
                            .setDescription(`**${args[i]}** is not a valid Currency\n\n**Available Currency**\n${Banking.Currencys.join("\n")}`)
                            .setFooter(Status.InvalidCommandMessage())
                    ]
                });
            }
        }
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Usage")
                    .setColor(Status.StatusColor("ERROR"))
                    .addFields(
                        { name: "Bracket Definitions", value: "{Required} [optional]" },
                        { name: "bank open {currency}", value: `\n**Available Currency**\n>>> ${Banking.Currencys.join("\n")}` }
                    )
                    .setFooter(Status.InvalidCommandMessage())
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "bankOpenAccount",
    aliases: [
        [ "create" ],
        [ "make" ],
        [ "open" ]
    ],
    Run
}