const Discord = require("discord.js");
const FileSystem = require("fs");
const Status = require("../../include/Status.js");
const Banking = require("../../include/Banking.js");

function Run(message, args, args_with_case, client) {
    /* 
     * Args
     * [1] bank
     * [2] SendMonies
     * [3] Sum
     * [4] Recipients
     */

    /* 
     * I try to make this code as tolerant as possible
     * that way it doesn"t matter if the arguments arent
     * in the right order.
     * Lets hope I dont fuck it up :)
     */

    var Sum = 0;

    if (args.length > 3 && message.mentions.users.size) {
        for (var i = 0; i < args.length; i++) {
            if (parseInt(args[i]) > 0) {
                Sum = parseInt(args[i]);
            }
        }

        if (Banking.DoesUserExist(message.author) && Banking.DoesUserExist(message.mentions.users.first())) {
            var SenderDetails = Banking.GetUserDetails(message.author);
            var RecipientDetails = Banking.GetUserDetails(message.mentions.users.first());

            if (BankStats[message.mentions.users.first().id]["Balance"].hasOwnProperty(BankStats[message.author.id]["ActiveCurrency"])) {
                if (SenderDetails.BalancesJSON[SenderDetails.ActiveCurrency] > Sum) {
                    Banking.TransferMoney(message.author, message.mentions.users.first(), Sum);
                }

                SenderDetails = Banking.GetUserDetails(message.author);
                RecipientDetails = Banking.GetUserDetails(message.mentions.users.first());

                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("FakeAwake Banking")
                            .setColor(Status.StatusColor("OK"))
                            .setDescription(`Transaction of **${Sum} ${SenderDetails.ActiveCurrency}** was successful!\n\n**New Balance**\n${message.author}: ${SenderDetails.BalancesJSON[SenderDetails.ActiveCurrency]} ${SenderDetails.ActiveCurrency}\n${message.mentions.users.first()}: ${RecipientDetails.BalancesJSON[SenderDetails.ActiveCurrency]} ${SenderDetails.ActiveCurrency}`)
                            .setFooter("You are now broker, your friend is now richer! :)")
                    ]
                });
            } else {
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("FakeAwake Banking")
                            .setColor(Status.StatusColor("ERROR"))
                            .setDescription(`${message.author}, your active currency is set to ${SenderDetails.ActiveCurrency}\n${message.mentions.users.first()} does not have an account open for ${SenderDetails.ActiveCurrency}\nIf you would like to send money using a different currency you can change it using **.bank setactivecurrency** or **.bank sac**`)
                            .setFooter(Status.InvalidCommandMessage())
                    ]
                });
            }
        }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "bankSendMoney",
    aliases: [
        [ "bank", "send" ],
        [ "bank", "sendmoney" ],
        [ "bank", "sendmonies" ],
        [ "bank", "sm" ]
    ],
    Run
}