const Discord = require("discord.js");
const Random = require("../../include/Random.js");
const Utils = require("../../include/Utils.js");
const Status = require("../../include/Status.js");
const FileSystem = require("fs");
const Neko = require("nekos.life");
const Https = require("https");

const Lewd = FileSystem.readdirSync("./Assets/Images/Waifus/Lewd")
const NekoClient = new Neko();

const WAIFU_TYPE_DROPDOWN = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageSelectMenu()
            .setCustomId("waifu-type")
            .setPlaceholder("Select Type of Waifu")
            .addOptions([
                {
                    label: "Avatar",
                    value: "avatar",
                    emoji: "772950364437610518"
                },
                {
                    label: "Baka",
                    value: "baka",
                    emoji: "801036170447290379"
                },
                {
                    label: "Cuddle",
                    value: "cuddle",
                    emoji: "883376930282414100"
                },
                {
                    label: "Feed",
                    value: "feed",
                    emoji: "852926235919122452"
                },
                {
                    label: "Foxgirl",
                    value: "foxgirl",
                    emoji: "800166987099144192"
                },
                {
                    label: "Genetically Engineered Catgirl",
                    value: "gecg",
                    emoji: "951057797037064213"
                },
                {
                    label: "Gif",
                    value: "gif",
                    emoji: "731674232303648878"
                },
                {
                    label: "Goose",
                    value: "goose",
                    emoji: "918653131565432852"
                },
                {
                    label: "Holo",
                    value: "holo",
                    emoji: "880478962218840084"
                },
                {
                    label: "Kemonomimi",
                    value: "kemonomimi",
                    emoji: "846502296794693632"
                },
                {
                    label: "Kiss",
                    value: "kiss",
                    emoji: "788152154585301022"
                },
                {
                    label: "Lewd",
                    value: "lewd",
                    emoji: "852923680718848060"
                },
                {
                    label: "Meow",
                    value: "meow",
                    emoji: "885283542576295957"
                },
                {
                    label: "Neko",
                    value: "neko",
                    emoji: "638480830204870710"
                },
                {
                    label: "Pat",
                    value: "pat",
                    emoji: "822152587033837579"
                },
                {
                    label: "Poke",
                    value: "poke",
                    emoji: "881674533579395114"
                },
                {
                    label: "Slap",
                    value: "slap",
                    emoji: "638480830204870710"
                },
                {
                    label: "Smug",
                    value: "smug",
                    emoji: "701255431854489630"
                },
                {
                    label: "Tickle",
                    value: "tickle",
                    emoji: "852924118239936522"
                },
                {
                    label: "Wallpaper",
                    description: "⚠ Despite coming from the SFW side of Nekos.life some of the wallpapers are still NSFW.",
                    value: "wallpaper",
                    emoji: "586303697739448320"
                },
                {
                    label: "Woof",
                    value: "woof",
                    emoji: "808379650341339175"
                }
            ])
    );

const BUTTONS = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId("next")
            .setLabel("Another One")
            .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("save-to-channel")
            .setLabel("Send to Channel")
            .setStyle("PRIMARY")
    );

var image = null;
var g_waifu_type;

async function add_waifu_to_embed(waifu_type) {
    image = null;
    var NekoEmbed = new Discord.MessageEmbed()
        .setTitle("Heard you like Waifus")
        .setDescription(`Neko`)
        .setColor("#edd6ff")
        .setFooter(`nya~`);

    switch (waifu_type) {
        case "avatar":
        case "-avatar":
            await NekoClient.sfw.avatar().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Avatar");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "baka":
        case "-baka":
            await NekoClient.sfw.baka().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Baka");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "cuddle":
        case "-cuddle":
            await NekoClient.sfw.cuddle().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Cuddle");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "feed":
        case "-feed":
            await NekoClient.sfw.feed().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Feed");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "foxgirl":
        case "-foxgirl":
            await NekoClient.sfw.foxGirl().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Fox Girl");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "gecg":
        case "-gecg":
            await NekoClient.sfw.gecg().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Genetically Engineered Catgirl");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "gif":
        case "-gif":
            await NekoClient.sfw.nekoGif().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Animated");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "goose":
        case "-goose":
            await NekoClient.sfw.goose().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Goose?");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "holo":
        case "-holo":
            await NekoClient.sfw.holo().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Holo");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "kemonomimi":
        case "-kemonomimi":
            await NekoClient.sfw.kemonomimi().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Kemonomimi");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "kiss":
        case "-kiss":
            await NekoClient.sfw.kiss().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Kiss");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "lewd":
        case "-lewd":
            {
                idx = Random.RandInt(0, Lewd.length);
                image = new Discord.MessageAttachment(`./Assets/Images/Waifus/Lewd/${Lewd[idx]}`);
                NekoEmbed.setDescription("Lewd");
                NekoEmbed.setImage(`attachment://${Lewd[idx]}`);
            }
            return NekoEmbed;

        case "meow":
        case "-meow":
            await NekoClient.sfw.meow().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Meow");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "miku":
        case "-miku":
            {
                const request = Https.request({
                    hostname: "miku-for.us",
                    path: "/api/v2/random",
                    method: "GET"
                }, response => {
                    console.log(`${Utils.GetTimeStamp()} StatusCode: ${response.statusCode}`);

                    response.on("data", Data => {
                        const Parsed = JSON.parse(Data);
                        console.log(Parsed);
                        NekoEmbed.setDescription("Miku");
                        NekoEmbed.setImage(Parsed["url"]);
                        return NekoEmbed;
                    });
                });

                request.on("error", error => {
                    console.error(error);
                })

                request.end();
            }
            break;

        case "mio":
        case "-mio":
            NekoEmbed.setDescription("Just for Jk");
            NekoEmbed.attachFiles(["./Assets/Images/mio.gif"])
            NekoEmbed.setImage("attachment://mio.gif");
            break;

        case "neko":
        case "-neko":
            await await NekoClient.sfw.neko().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Neko");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "pat":
        case "-pat":
            await NekoClient.sfw.pat().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Pat");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "poke":
        case "-poke":
            await NekoClient.sfw.poke().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Poke");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "slap":
        case "-slap":
            await NekoClient.sfw.slap().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Slap");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "smug":
        case "-smug":
            await NekoClient.sfw.smug().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Smug");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "tickle":
        case "-tickle":
            await NekoClient.sfw.tickle().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Tickle");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "wallpaper":
        case "-wallpaper":
            await NekoClient.sfw.wallpaper().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("Wallpaper");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;

        case "woof":
        case "-woof":
            await NekoClient.sfw.woof().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                NekoEmbed.setDescription("A dooge?");
                NekoEmbed.setImage(image.url);
            });
            return NekoEmbed;
    }
}

function Run(message, args, args_with_case, client) {
    if (message.content.includes("flag")) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Waifu Flags (No proper naughty naughty stuff)")
                    .setDescription("waifu [flag]")
                    .setColor(Status.StatusColor("OK"))
                    .addFields(
                        { name: "Flags", value: "`avatar` `baka` `cuddle` `feed` `foxgirl` `gecg` `gif` `goose` `holo` `kemonomimi` `kiss` `lewd` `meow` `neko` `pat` `poke` `slap` `smug` `tickle` `wallpaper` `woof`" },
                    )
                    .setFooter("I exist :)")
            ]
        });
    } else {
        if (args.length === 1) args.push("avatar");

        for (let i = 1; i < args.length; i++) {
            g_waifu_type = args[i];
            add_waifu_to_embed(args[i]).then(embed => {
                var g_embed = embed;
                var context = { embeds: [embed], components: [WAIFU_TYPE_DROPDOWN, BUTTONS] };
                if (image !== null) {
                    context = { embeds: [embed], files: [image], components: [WAIFU_TYPE_DROPDOWN, BUTTONS] };
                }

                message.channel.send(context).then(() => {
                    var waifu_type = g_waifu_type;

                    client.on("interactionCreate", interaction => {
                        if (interaction.customId === "waifu-type") {
                            waifu_type = interaction.values[0];
                            add_waifu_to_embed(interaction.values[0]).then(embed => {
                                interaction.update({ embeds: [embed] });
                            });
                        }

                        if (interaction.customId === "save-to-channel") {
                            const FILTER = response => response.author === interaction.user;
                            interaction.reply({ content: `${interaction.user}, tag the following channels you"d like to send this image to.` }, { fetchReply: true }).then(() => {
                                interaction.channel.awaitMessages({ FILTER, max: 1, time: 30000, errors: ["time"] })
                                    .then(collected => {
                                        collected.first().mentions.channels.forEach(channel => {
                                            channel.send(g_embed.image.url);
                                        });

                                        interaction.channel.send(`Saved to ${Array.from(collected.first().mentions.channels.values()).join(", ")} by ${collected.first().author}`);
                                        interaction.deleteReply();
                                        collected.first().delete();
                                    })
                                    .catch(() => {
                                        interaction.deleteReply();
                                    });
                            });
                        }

                        if (interaction.customId === "next") {
                            add_waifu_to_embed(waifu_type).then(new_embed => {
                                g_embed = new_embed;
                                interaction.update({ embeds: [new_embed] });
                            });
                        }
                    });
                });
            });
        }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "waifu",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "waifu" ]
    ],
    Run
}
