const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Banking = require("../../include/Banking.js");

function Run(message, args, args_with_case, client) {
    if (Banking.DoesUserExist(message.author)) {
        if (Banking.Currencys.includes(args[2])) {
            Banking.SetActiveCurrency(message.author, args[2]);
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("FakeAwake Banking")
                        .setColor(Status.StatusColor("OK"))
                        .setThumbnail("attachment://OnePoundCoin.png")
                        .setDescription(`${message.author}\nSet active currency to ${args[2]}!`)
                        .setFooter("Set current payment method")
                ]
            });
        } else {
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("Usage")
                        .setColor(Status.StatusColor("ERROR"))
                        .setDescription(`${args[2]} is not a valid Currency\n**Available Currency**\n${Banking.Currencys.join("\n")}`)
                        .setFooter(Status.InvalidCommandMessage())
                ]
            });
        }
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Usage")
                    .setColor(Status.StatusColor("ERROR"))
                    .addFields(
                        { name: "Bracket Definitions", value: "{Required} [optional]" },
                        { name: "bank setactivecurrency {currency}", value: `**Available Currency**\n${Banking.Currencys.join("\n")}` }
                    )
                    .setFooter(Status.InvalidCommandMessage())
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "bankSetActiveCurrency",
    aliases: [
        [ "bank", "sm" ],
        [ "bank", "send" ],
        [ "bank", "sendmoney" ],
        [ "bank", "sendmonies" ]
    ],
    Run
}