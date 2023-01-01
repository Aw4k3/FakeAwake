const Discord = require("discord.js");
const FileSystem = require("fs");
const Status = require("../../include/Status.js");
const Random = require("../../include/Random.js");
const GuildSettings = require("../../include/GuildSettings.js");

const ICON = new Discord.MessageAttachment("./Assets/Images/8BallIcon.png");

function AllowResponse(response, message) {
    var guild_configs = GuildSettings.read_config();

    if (Object.keys(guild_configs).includes(message.guild.id)) {
        if (Object.keys(guild_configs[message.guild.id]).includes(GuildSettings.PROPERTIES.SFW)) {
            if (guild_configs[message.guild.id][GuildSettings.PROPERTIES.SFW] === response.NSFW) {
                return false;
            };
        }
    }

    return true;
}

function Run(message, args, args_with_case, client) {
    if (args.length > 1) {
        var responses = JSON.parse(FileSystem.readFileSync("./Assets/Data/8BallResponses.json"));
        var response = null;
        do response = responses[Random.RandInt(0, responses.length)]; while (!AllowResponse(response, message));

        message.channel.send(
            {
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("8Ball")
                        .setColor(Status.StatusColor("OK"))
                        .setThumbnail("attachment://8BallIcon.png")
                        .setDescription(`**8Ball Says**\n${response.response}`)
                        .setFooter("8Ball")
                ],
                files: [
                    ICON
                ]
            }
        );
    } else {
        message.channel.send(
            {
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("8Ball")
                        .setColor(Status.StatusColor("OK"))
                        .setThumbnail("attachment://8BallIcon.png")
                        .setDescription(`**8Ball Says**\nThere was no question, just like there was no dad.`)
                        .setFooter("8Ball")
                ],
                files: [
                    ICON
                ]
            }
        );
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "8ball",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "8ball" ]
    ],
    Run
}