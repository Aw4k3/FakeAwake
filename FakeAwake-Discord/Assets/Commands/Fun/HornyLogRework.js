const Discord = require("discord.js");
const FileSystem = require("fs");
const UserStats = require("../../include/UserStatsLogger.js");
const Utils = require("../../include/Utils.js");

const ICON = new Discord.MessageAttachment("./Assets/Images/PinkJailCell.png");

const BUTTONS = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId("previous")
            .setLabel("Prev")
            .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("next-page")
            .setLabel("Next")
            .setStyle("PRIMARY")
    );


var embed_pages = [];

class Entry {
    UserID = null;
    Count = 0;

    constructor(userid, count) {
        this.UserID = userid;
        this.Count = count;
    }
}

function Run(message, args, args_with_case, client) {
    var Entries = [];
    var total = 0
    var JObject = JSON.parse(FileSystem.readFileSync(UserStats.StatsFilePath, "utf8"));

    // Load all Entries
    for (var i = 0; i < Object.keys(JObject).length; i++) {
        if (Object.keys(JObject[Object.keys(JObject)[i]]).includes(UserStats.STATS.WEEWOOS_RECEIVED)) {
            total = 0;

            for (var key in JObject[Object.keys(JObject)[i]][UserStats.STATS.WEEWOOS_RECEIVED]) {
                total += JObject[Object.keys(JObject)[i]][UserStats.STATS.WEEWOOS_RECEIVED][key];
            }

            // for (var j = 0; j < Object.keys(JObject[Object.keys(JObject)[i]][UserStats.STATS.WEEWOOS_RECEIVED]).length; j++) {
            //     console.log(JObject[Object.keys(JObject)[i]][UserStats.STATS.WEEWOOS_RECEIVED][j]);
            //     total += JObject[Object.keys(JObject)[i]][UserStats.STATS.WEEWOOS_RECEIVED][j];
            // }

            Entries.push(new Entry(
                Object.keys(JObject)[i],
                total
            ));
        }
    }

    // Sort Entries
    var swapmade = true;

    while (swapmade) {
        swapmade = false;
        for (let i = 0; i < Entries.length - 1; i++) {
            if (Entries[i].Count > Entries[i + 1].Count) {
                var temp = Entries[i];
                Entries[i] = Entries[i + 1];
                Entries[i + 1] = temp;
                swapmade = true;
            }
        }
    }

    // Convert to String
    var StringEntry = [];

    for (let i = 0; i < Entries.length; i++) {
        StringEntry.push(`<@${Entries[i].UserID}>: ${Entries[i].Count}`);
    }

    StringEntry.reverse();

    // Make Pages
    embed_pages = [];
    var ticker = 0;
    var page_contents = [];
    for (let i = 0; i < StringEntry.length; i++) {
        page_contents.push(StringEntry[i]);

        if (ticker++ === 9 || i === StringEntry.length - 1) {
            embed_pages.push(
                new Discord.MessageEmbed()
                    .setTitle("Horny Jail Log")
                    .setDescription(page_contents.join("\n"))
                    .setColor("#ff00c3")
                    .setThumbnail("attachment://PinkJailCell.png")
                    .setFooter(`Some of them even made it in more than once`));


            ticker = 0;
            page_contents = [];
        }
    }

    var page = 0;

    embed_pages[0].setFooter(`Page ${page + 1} of ${embed_pages.length} | Some of them even made it in more than once`);

    message.channel.send({
        embeds: [
            embed_pages[page]
        ],
        files: [
            ICON
        ],
        components: [
            BUTTONS
        ]
    })
        .then(() => {
            client.on("interactionCreate", interaction => {
                if (interaction.isButton()) {
                    if (interaction.customId === "previous-page") {
                        page = Utils.loop_iterator(page, 0, embed_pages.length - 1, true);
                        embed_pages[page].setFooter(`Page ${page + 1} of ${embed_pages.length} | Some of them even made it in more than once`);
                        interaction.update({
                            embeds: [
                                embed_pages[page]
                            ]
                        });
                    }

                    if (interaction.customId === "next-page") {
                        page = Utils.loop_iterator(page, 0, embed_pages.length - 1);
                        embed_pages[page].setFooter(`Page ${page + 1} of ${embed_pages.length} | Some of them even made it in more than once`);
                        interaction.update({
                            embeds: [
                                embed_pages[page]
                            ]
                        });
                    }
                }
            });
        });

    return true;
}

module.exports = {
    NSFW: false,
    name: "hornylog_rework",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "hornylog" ]
    ],
    Run
}