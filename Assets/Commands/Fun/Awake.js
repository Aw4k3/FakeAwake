const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    message.channel.send({
        embeds: [
            new Discord.MessageEmbed()
                .setTitle("Awake's Links")
                .setColor(Status.StatusColor("OK"))
                .setURL("https://www.twitch.tv/awake_live")
                .setDescription(`Twitch: https://www.twitch.tv/awake_live\nYouTube: https://www.youtube.com/channel/UCIaFBHd0AOddEhocuG3YB5g`)
                .setFooter("Hint: You should follow Awake on Twitch so you don't miss a stream")
        ]
    }
    );

    return true;
}

module.exports = {
    NSFW: false,
    name: "awake",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "awake" ]
    ],
    Run
}