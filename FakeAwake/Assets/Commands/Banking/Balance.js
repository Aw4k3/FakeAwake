const Discord = require("discord.js");
const FileSystem = require("fs");
const Status = require("../../include/Status.js");
const Banking = require("../../include/Banking.js");

function DisplayBalance(user, message) {
    if (Banking.DoesUserExist(user)) {
        var description_lines = [];

        description_lines.push(`**Active Currency**: ${BankStats[user.id]["ActiveCurrency"]}`);

        for (var i = 0; i < Object.keys(BankStats[user.id]["Balance"]).length; i++) {
            description_lines.push(`**${Object.keys(BankStats[user.id]["Balance"])[i]}**: ${BankStats[user.id]["Balance"][Object.keys(BankStats[user.id]["Balance"])[i]]}`);
        }

        let Icon = new Discord.MessageAttachment("./Assets/Images/OnePoundCoin.png");

        switch (BankStats[user.id]["ActiveCurrency"]) {
            case "PauseFish":
                Icon = new Discord.MessageAttachment("./Assets/Images/PauseFishCoin.png");
                break;

            case "GachiGold":
                Icon = new Discord.MessageAttachment("./Assets/Images/GachiGold.png");
                break;

            case "GreatBritishPound":
                Icon = new Discord.MessageAttachment("./Assets/Images/OnePoundCoin.png");
                break;
        }

        message.channel.send(
            {
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("FakeAwake Banking")
                    .setColor("#808080")
                    .setThumbnail(`attachment://${Icon.attachment.replace("./Assets/Images/", "")}`)
                    .setDescription(`${user}\n${description_lines.join("\n")}`)
                    .setFooter("Mans Rich")
                ],
                files: [
                    Icon
                ]
            }
        );
    } else {
        let Icon = new Discord.MessageAttachment("./Assets/Images/OnePoundCoin.png");

        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("FakeAwake Banking")
                    .setColor("#808080")
                    .setThumbnail(`attachment://${Icon.attachment.replace("./Assets/Images/", "")}`)
                    .setDescription(`${user}, you do not have a bank account.\nOpen one by using ".bank open" followed by a currency.\n**Available Currency**\n>>> ${Banking.Currencys.join("\n")}`)
                    .setFooter("Mans Broke")
            ],
            files: [
                Icon
            ]
        });
    }
}

function Run(message, args, args_with_case, client) {
    if (message.mentions.users.size) {
        message.mentions.users.forEach(user => {
            DisplayBalance(user, message);
        });
    } else {
        DisplayBalance(message.author, message);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "BankBalance",
    aliases: [
        [ "bal" ],
        [ "balance" ],
        [ "money" ],
        [ "monies" ]
    ],
    Run
}