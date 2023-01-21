const Discord = require("discord.js");
const FileSystem = require("fs");
const Random = require("../../include/Random.js");
const UserStats = require("../../include/userStatsLogger");
const WebClient = require("../../include/WebClient.js");

const FOOTER = [
    "Goodnight :)",
    "Sweet Dreams :)",
    "Sleep well :)"
];

function Run(message, args, args_with_case, client) {
    // Variable Declarations
    const ICON = "./Assets/Gifs/KannaSleep.gif";
    var tuck_gifs = JSON.parse(FileSystem.readFileSync("./Assets/Data/TuckGifs.json"));
    var tuck_in_gif = null;
    var Embed = new Discord.MessageEmbed()
        .setTitle("Tucks")
        .setColor("#f582ff")
        .setThumbnail("attachment://KannaSleep.gif")
        .setFooter(`Tucked into bed by ${message.author.tag} | ${FOOTER[Random.RandInt(0, FOOTER.length)]}`, message.author.avatarURL());

    // Set Tuck Gifs
    for (var i = 0; i < Object.keys(tuck_gifs).length; i++) {
        if (Object.keys(tuck_gifs)[i] === message.author.id) {
            tuck_in_gif = new Discord.MessageAttachment(`./Assets/Gifs/Tucks/${message.author.id}.gif`);
            Embed.setImage(`attachment://${message.author.id}.gif`)
        }
    }

    if (message.mentions.users.size === 1) {
        // Single Tuck In
        Embed.setDescription(`${message.author} tucks ${message.mentions.users.first()} into bed ^^`)

        let context = {
            embeds: [Embed],
            files: [ICON]
        };

        if (tuck_in_gif !== null) { context.files.push(tuck_in_gif); }

        message.channel.send(context);

        message.mentions.users.forEach(user => {
            UserStats.LogUserStat(message.author, "TuckedIn", user);
            UserStats.LogUserStat(user, "TuckedInBy", message.author);
        });
    } else if (message.mentions.users.size > 1) {
        // Multi Tuck In
        Embed.addField("Tucks in", Array.from(message.mentions.users.values()).join("\n"))

        let context = {
            embeds: [Embed],
            files: [ICON]
        };

        if (tuck_in_gif !== null) { context.files.push(tuck_in_gif); }

        message.channel.send(context);

        message.mentions.users.forEach(user => {
            UserStats.LogUserStat(message.author, "TuckedIn", user);
            UserStats.LogUserStat(user, "TuckedInBy", message.author);
        });
    } else {
        if (message.attachments.size > 0) {
            if (message.attachments.first().name.split(".")[1] === "gif") {
                WebClient.DownloadFile(message.attachments.first().url, `./Assets/Gifs/Tucks/${message.author.id}.gif`, function () {
                    if (Object.keys(tuck_gifs).includes(message.author.id)) {
                        tuck_gifs[message.author.id]["Path"] = `./Assets/Gifs/Tucks/${message.author.id}.gif`;
                    } else {
                        tuck_gifs[message.author.id] = {
                            "Tag": message.author.tag,
                            "Path": `./Assets/Gifs/Tucks/${message.author.id}.gif`
                        }
                    }

                    FileSystem.writeFileSync("./Assets/Data/TuckGifs.json", JSON.stringify(tuck_gifs, null, 2));

                    message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                                // .setTitle("Hugs")
                                .setColor("#f582ff")
                                .setThumbnail("attachment://AnimeHug.gif")
                                .setDescription(`Tuck gif set`)
                        ]
                    })
                });
            }
        } else {
            // Non User
            args.shift();

            Embed.setDescription(`${message.author} tucks ${args.join(" ")} into bed`)

            let context = {
                embeds: [Embed],
                files: [ICON]
            };

            if (tuck_in_gif !== null) { context.files.push(tuck_in_gif); }

            message.channel.send(context);
        }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "tuck_rework",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "tuck" ]
    ],
    Run
}