const Discord = require("discord.js");
const Random = require("../../include/Random.js");
const Utils = require("../../include/Utils.js");

var icon = null;

function SpecialCase(embed, message) {
    icon = null;
    switch (embed.title.split(" ")[0]) {
        case "Drunk":
            icon = new Discord.MessageAttachment("./Assets/Images/Wine.png");
            embed.setThumbnail("attachment://Wine.png");
            break;

        case "Gay":
            icon = new Discord.MessageAttachment("./Assets/Images/GachiBallPride.png");
            embed.setThumbnail("attachment://GachiBallPride.png");
            break;

        case "Horny":
            icon = new Discord.MessageAttachment("./Assets/Images/awakeGasm.png");
            embed.setThumbnail("attachment://awakeGasm.png")
            break;

        case "Sleepy":
            switch (message.author.id) {
                // case "301985885870882827":
                default: // Awake
                    icon = new Discord.MessageAttachment("./Assets/Images/AwakeSleepA.gif");
                    embed.setThumbnail("attachment://AwakeSleepA.gif")
                    break;

                case "311593459628900352": // Browdy
                    icon = new Discord.MessageAttachment("./Assets/Images/BrowdySleepA.gif");
                    embed.setThumbnail("attachment://BrowdySleepA.gif")
                    break;

                case "227897664333676544": // Eevee
                    icon = new Discord.MessageAttachment("./Assets/Images/EeveeSleepA.gif");
                    embed.setThumbnail("attachment://EeveeSleepA.gif")
                    break;

                case "713807072105332817": // Serenity
                    icon = new Discord.MessageAttachment("./Assets/Images/SerenitySleepA.gif");
                    embed.setThumbnail("attachment://SerenitySleepA.gif")
                    break;
            }
            break;
    }

    return embed;
}

function Run(message, args, args_with_case, client) {
    var entries = []
    var upper = 101;

    if (message.content.includes("-overload")) {
        upper = Number.MAX_SAFE_INTEGER;
    }

    if (message.mentions.members.size) {
        message.mentions.members.forEach(user => {
            var s = args.join(" ").substring(3);
            entries.push(`${user}: ${Random.RandInt(0, upper)}% ${s}`);
        });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${Utils.CapitilizeFirstLetter(s)} Check`)
            .setColor("#000000")
            .setDescription(entries.join("\n"));

        let i_hate_discordjs_v_thirteen = {
            embeds: [
                SpecialCase(embed, message)
            ]
        };

        if (icon !== null) { i_hate_discordjs_v_thirteen.files = [icon]; }

        message.channel.send(i_hate_discordjs_v_thirteen);
    } else {
        var s = args.join(" ").substring(3);

        let embed = new Discord.MessageEmbed()
            .setTitle(`${Utils.CapitilizeFirstLetter(s)} Check`)
            .setColor("#000000")
            .setDescription(`${message.author.toString()}: ${Random.RandInt(0, 101)}% ${s}`);

        let i_hate_discordjs_v_thirteen = {
            embeds: [
                SpecialCase(embed, message)
            ]
        };

        if (icon !== null) { i_hate_discordjs_v_thirteen.files = [icon]; }

        message.channel.send(i_hate_discordjs_v_thirteen);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "howX",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "how" ]
    ],
    Run
}