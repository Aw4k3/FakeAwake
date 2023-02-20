const Discord = require("discord.js");
const Sharp = require("sharp");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");
const Random = require("../../include/Random.js");

function get_description(sender, receiver) {
    const DESCRIPTIONS = [
        `${sender} loves ${receiver} so much, they gifted a snowball right to their face!`,
        `${sender} hates ${receiver} so much, they thew a snowball right in their face!`,
        `${sender} is an asshole, so they hit ${receiver} with a snowball! Meany!`
    ];

    return DESCRIPTIONS[Random.RandInt(0, DESCRIPTIONS.length)]
}

function Run(message, args, args_with_case, client) {
    if (message.mentions.users.size) {
        // Download sender avatar
        WebClient.DownloadFile(message.author.avatarURL() || message.author.defaultAvatarURL(), "./Assets/temp/snowball1.webp", () => {
            // Download receiver avatar
            WebClient.DownloadFile(message.mentions.users.first().avatarURL() || message.mentions.users.first().defaultAvatarURL(), "./Assets/temp/snowball2.webp", () => {
                // Composite
                Sharp("./Assets/Images/snowcityjapan.png")
                    .composite([
                        {
                            input: "./Assets/temp/snowball1.webp",
                            top: 180,
                            left: 60
                        },
                        {
                            input: "./Assets/temp/snowball2.webp",
                            top: 180,
                            left: 322
                        },
                        {
                            input: "./Assets/temp/snowballsplat.png",
                            top: 180,
                            left: 60
                        }
                    ])
                    .toFile("./Assets/temp/snowballcomp.png")
                    .then(() => {
                        var composited_image = new Discord.MessageAttachment("./Assets/temp/snowballcomp.png")
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Snowball Fight")
                                    .setDescription(get_description(message.author, message.mentions.users.first()))
                                    .setColor("#ffffff")
                                    .setImage("attachment://snowballcomp.png")
                            ],
                            files: [
                                composited_image
                            ]
                        });
                    });
            });
        });
    } else {
        message.channel.send("No target specified");
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "snowball",
    category: global.COMMAND_CATEGORIES.CHRISTMAS.NAME,
    aliases: [
        [ "snowball" ]
    ],
    Run
}