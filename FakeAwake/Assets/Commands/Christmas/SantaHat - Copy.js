const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");
const Sharp = require("sharp");
const FileSystem = require("fs");

function Run(message, args, args_with_case, client) {
    if (message.mentions.members.size) {
        /*********** Download users profile image ***********/
        console.log(`${Utils.GetTimeStamp()} [Download] Downloading profile image of ${message.mentions.users.first().avatarURL().username}`);
        console.log(`${Utils.GetTimeStamp()} [Download] Avatar URL: ${message.mentions.users.first().avatarURL()}`);
        WebClient.DownloadFile(message.mentions.users.first().avatarURL({ size: 512 }) || message.mentions.users.first().defaultAvatarURL, "./Assets/temp/avatar512.webp", function () {
            console.log(`${Utils.GetTimeStamp()} [Download] Downloaded profile image of ${message.mentions.users.first().avatarURL().username}`);
            Sharp("./Assets/temp/avatar128.webp").resize(310, 310).toFile("./Assets/temp/avatar310.webp").finally(() => {
                Sharp("./Assets/Images/SantaHat.png")
                    .composite([
                        {
                            input: "./Assets/temp/avatar310.webp",
                            top: 198,
                            left: 80
                        },
                        {
                            input: "./Assets/Images/SantaHat.png"
                        }
                    ])
                    .toFile("./Assets/temp/santahatcomp.png", function (e) {
                        console.log(`${Utils.GetTimeStamp()} ${e}`)
                        var item_image = new Discord.MessageAttachment("./Assets/temp/santahatcomp.png");
                        /*********** Send Embed ***********/
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Santa Hat")
                                    .setDescription("Nice hat")
                                    .setColor(Status.StatusColor("OK"))
                                    .setImage("attachment://santahatcomp.png")
                                    .setFooter(":)")
                            ],
                            files: [
                                item_image
                            ]
                        });
                    });
            })
        });
    } else if (message.attachments.size > 0) {
        var fileExtension = message.attachments.first().name.split(".")[1];
        WebClient.DownloadFile(message.attachments.first().url, `./Assets/temp/uneditedImage.${fileExtension}`, function () {
            Sharp(`./Assets/temp/uneditedImage.${fileExtension}`).resize(310, 310).toFile(`./Assets/temp/resizededImage.${fileExtension}`).then(() => {
                Sharp("./Assets/Images/SantaHat.png")
                    .composite([
                        {
                            input: `./Assets/temp/resizededImage.${fileExtension}`,
                            top: 198,
                            left: 80
                        },
                        {
                            input: "./Assets/Images/SantaHat.png"
                        }
                    ])
                    .toFile("./Assets/temp/santahatcomp.png", function (e) {
                        console.log(`${Utils.GetTimeStamp()} ${e}`)
                        var item_image = new Discord.MessageAttachment("./Assets/temp/santahatcomp.png");
                        /*********** Send Embed ***********/
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Santa Hat")
                                    .setDescription("Nice hat")
                                    .setColor(Status.StatusColor("OK"))
                                    .setImage("attachment://santahatcomp.png")
                                    .setFooter(":)")
                            ],
                            files: [
                                item_image
                            ]
                        });
                    });
            });
        });
    } else {
        message.channel.send("I didnt make a error handler yet, deal with it");
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "santahat",
    category: global.COMMAND_CATEGORIES.CHRISTMAS.NAME,
    aliases: [
        [ "santahat" ],
        [ "sh" ]
    ],
    Run
}