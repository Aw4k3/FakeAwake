const Discord = require("discord.js");
const Sharp = require("sharp");
const FileSystem = require("fs");
const Status = require("../../include/Status.js");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");
const UserStats = require("../../include/userStatsLogger");

const ICON = new Discord.MessageAttachment("./Assets/Images/Weewoo.png");

const COMPOSITIONS = {
    "SuperHorny": {
        "Aliases": [
            "superhorny",
            "sh"
        ],
        "Composition": [
            {
                input: "./Assets/Images/WorstPrisonCell.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "CatBoy": {
        "Aliases": [
            "catboy",
            "catboys"
        ],
        "Composition": [
            {
                input: "./Assets/Images/CatBoysOno.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "Christmas": {
        "Aliases": [
            "christmas",
            "santa",
            "xmas"
        ],
        "Composition": [
            {
                input: "./Assets/Images/ChristmasBG.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/SantaHat_Lights.png",
            },
            {
                input: "./Assets/Images/ChristmasCellBars.png"
            }
        ]
    },
    "Duolingo": {
        "Aliases": [
            "duo",
            "duolingo",
            "birb",
            "bird"
        ],
        "Composition": [
            {
                input: "./Assets/Images/DuoPrison.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "Easter": {
        "Aliases": [
            "easter"
        ],
        "Composition": [
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/TopRibbon.png",
                top: 0,
                left: 0
            },
            {
                input: "./Assets/Images/IconRibbons.png",
            },
            {
                input: "./Assets/Images/Bunnies.png",
            },
            {
                input: "./Assets/Images/PinkCellBars.png"
            }
        ]
    },
    "Lab": {
        "Aliases": [
            "lab",
            "thelab",
            "science"
        ],
        "Composition": [
            {
                input: "./Assets/Images/Lab.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "Masturbatorium": {
        "Aliases": [
            "masturbatorium",
            "mb"
        ],
        "Composition": [
            {
                input: "./Assets/Images/Masturbatorium_2.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "McDonalds": {
        "Aliases": [
            "md",
            "mcd",
            "mcdeez",
            "mcdonald",
            "mcdonalds"
        ],
        "Composition": [
            {
                input: "./Assets/Images/Mcdonalds.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "McDonaldsDeepFried": {
        "Aliases": [
            "mddf",
            "mcddf",
            "mcdeezdf",
            "mcdonalddf",
            "mcdonalddeepfried",
            "mcdonaldsdeepfried"
        ],
        "Composition": [
            {
                input: "./Assets/Images/McdonaldsDeepFried.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "PauseFish": {
        "Aliases": [
            "pf",
            "pausefish"
        ],
        "Composition": [
            {
                input: "./Assets/Images/PauseFishFrame.png"
            },
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/IronBars.png"
            }
        ]
    },
    "Default": {
        "Aliases": [],
        "Composition": [
            {
                input: "./Assets/temp/avatar256.webp",
                gravity: "center"
            },
            {
                input: "./Assets/Images/PinkCellBars.png"
            }
        ]
    }
}

function Run(message, args, args_with_case, client) {
    if (message.mentions.members.size > 0) {
        var user = message.mentions.users.first();
        /*********** Log User ***********/
        var JObject = JSON.parse(FileSystem.readFileSync("./Assets/Data/HornyJail.json", "utf8"));

        UserStats.LogUserStat(message.author, UserStats.STATS.WEEWOOS_GIVEN, user);
        UserStats.LogUserStat(user, UserStats.STATS.WEEWOOS_RECEIVED, message.author);

        FileSystem.writeFileSync("./Assets/Data/HornyJail.json", JSON.stringify(JObject, null, 2));

        /*********** Set default profile image incase user doesn"t have a profile image Kappa ***********/

        var link = user.avatarURL({ size: 256 }) || user.defaultAvatar;

        /*********** Download users profile image ***********/
        console.log(`${Utils.GetTimeStamp()} [Download] Downloading profile image of ${user.tag}`);
        WebClient.DownloadFile(link, "./Assets/temp/avatar256.webp", async () => {
            console.log(`${Utils.GetTimeStamp()} [Download] Avatar URL: ${user.avatarURL()}`);
            console.log(`${Utils.GetTimeStamp()} [Download] Downloaded profile image of ${user.tag}`);

            /*********** Composite Images ***********/

            /* Comp Selection */
            var UseComp = COMPOSITIONS.Default.Composition;

            for (let i = 0; i < args.length; i++)
                for (let i = 0; i < Object.keys(COMPOSITIONS).length - 1; i++)
                    if (COMPOSITIONS[Object.keys(COMPOSITIONS)[i]]["Aliases"].includes(args[2]))
                        UseComp = COMPOSITIONS[Object.keys(COMPOSITIONS)[i]]["Composition"];

            await Sharp("./Assets/Images/PinkJailCell.png")
                .composite(UseComp)
                .png()
                .toFile("./Assets/temp/comp.png");

            var composited_image = new Discord.MessageAttachment("./Assets/temp/comp.png");

            await message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("Horny Jail")
                        .setDescription(`${user} has been weewoo'd to horny jail`)
                        .setColor("#ff00c3")
                        .setThumbnail("attachment://Weewoo.png")
                        .setImage("attachment://comp.png")
                        .setFooter(`Weewoo'd by ${message.author.tag}`, message.author.avatarURL())
                ],
                files: [ICON, composited_image]
            });

            FileSystem.unlinkSync("./Assets/temp/avatar256.webp");
            FileSystem.unlinkSync("./Assets/temp/comp.png");
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Usage")
                    .setColor(Status.StatusColor("ERROR"))
                    .addFields(
                        { name: "Bracket Definitions", value: "{Required} [optional]" },
                        { name: "weewoo {@username} [jail type]", value: "Yeetus the mans to horny jail" },
                        { name: "Jail Types", value: "`catboys` `christmas|santa|xmas` `easter` `lab|thelab|science` `md|mcd|mcdonald|mcdonalds` `mb|masturbatorium` `pf|pausefish` `superhorny`" }
                    )
                    .setFooter(Status.InvalidCommandMessage())
            ]
        });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "weewoo",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["weewoo"]
    ],
    Run
}