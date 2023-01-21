const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Random = require("../../include/random");

function Run(message, args, args_with_case, client) {
    if (Random.RandBool()) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Coin Flip")
                    .setColor(Status.StatusColor("OK"))
                    .setFooter("Heads", "https://www.royalmint.com/globalassets/the-royal-mint/images/pages/new-pound-coin/large_new_pound.png")
            ]
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Coin Flip")
                    .setColor(Status.StatusColor("OK"))
                    .setFooter("Tails", "https://media.wired.co.uk/photos/606da41a5113453af57347d2/master/w_1600%2Cc_limit/pound-coin.png")
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "coinflip",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "coinflip" ]
    ],
    Run
}