const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");
const Sharp = require("sharp");

function Run(message, args, args_with_case, client) {
    if (message.mentions.members.size) {
        /*********** Set default profile image incase user doesn"t have a profile image Kappa ***********/
        var link = message.mentions.users.first().avatarURL() || "https://harry.gg/forums/uploads/default/original/2X/f/f812e1fa53f09edb629ae7f128746118b2da94c5.png"

        /*********** Download users profile image ***********/
        console.log(Utils.GetTimeStamp() + "[Download] Downloading profile image of " + message.mentions.users.first().username);
        WebClient.DownloadFile(link, "./Assets/temp/avatar128.webp", function () {
            console.log(Utils.GetTimeStamp() + "[Download] Avatar URL: " + message.mentions.users.first().avatarURL());
            console.log(Utils.GetTimeStamp() + "[Download] Downloaded profile image of " + message.mentions.users.first().username);

            Sharp("./Assets/temp/avatar128.webp").resize(888, 888, { fit: Sharp.fit.fill }).toFile("./Assets/temp/avatar888.png").then(() => {
                Sharp("./Assets/Images/ShoppingTrolley/ShoppingTrolley.png")
                    .composite([
                        {
                            input: "./Assets/temp/avatar888.png",
                            top: 20,
                            left: 228
                        },
                        {
                            input: "./Assets/Images/ShoppingTrolley/ShoppingTrolleyFront.png"
                        }
                    ])
                    .toFile("./Assets/temp/ShoppingTrolleyItem.png", function (e) {
                        console.log(Utils.GetTimeStamp() + e)
                        var item_image = new Discord.MessageAttachment("./Assets/temp/ShoppingTrolleyItem.png");
                        /*********** Send Embed ***********/
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Shopping")
                                    .setDescription("Nice item you got there")
                                    .setColor(Status.StatusColor("OK"))
                                    .setImage("attachment://ShoppingTrolleyItem.png")
                                    .setFooter(":)")
                            ],
                            files: [
                                item_image
                            ]
                        });
                    });
            });
        });
    } else if (message.attachments.size > 0) {
        var fileExtension = message.attachments.first().name.split(".")[1];
        WebClient.DownloadFile(message.attachments.first().url, `./Assets/temp/uneditedImage.${fileExtension}`, function () {
            Sharp(`./Assets/temp/uneditedImage.${fileExtension}`).resize(888, 888).toFile(`./Assets/temp/resizededImage.${fileExtension}`).then(() => {
                Sharp("./Assets/Images/ShoppingTrolley/ShoppingTrolley.png")
                    .composite([
                        {
                            input: `./Assets/temp/resizededImage.${fileExtension}`,
                            top: 20,
                            left: 228,
                            fit: Sharp.fit.fill
                        },
                        {
                            input: "./Assets/Images/ShoppingTrolley/ShoppingTrolleyFront.png"
                        }
                    ])
                    .toFile("./Assets/temp/ShoppingTrolleyItem.png", function (e) {
                        console.log(Utils.GetTimeStamp() + e)
                        var item_image = new Discord.MessageAttachment("./Assets/temp/ShoppingTrolleyItem.png");
                        /*********** Send Embed ***********/
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Shopping")
                                    .setDescription("Nice item you got there")
                                    .setColor(Status.StatusColor("OK"))
                                    .setImage("attachment://ShoppingTrolleyItem.png")
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
    name: "shopping",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "shoppingcart" ],
        [ "shoppingtrolley" ],
        [ "shopping" ],
        [ "shop" ],
        [ "trolley" ],
        [ "cart" ]
    ],
    Run
}