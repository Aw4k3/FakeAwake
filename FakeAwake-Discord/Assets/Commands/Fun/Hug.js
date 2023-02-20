const Discord = require("discord.js");
const FileSystem = require("fs");
const Neko = require("nekos.life");
const UserStats = require("../../include/userStatsLogger");
const WebClient = require("../../include/WebClient.js");

const NekoAPI = new Neko();

async function Run(message, args, args_with_case, client) {
    // Variable Declarations
    const ICON = "./Assets/Gifs/AnimeHug.gif";
    var hug_gifs = JSON.parse(FileSystem.readFileSync("./Assets/Data/HugGifs.json"));
    var hug_gif = null;
    var Embed = new Discord.MessageEmbed()
        .setTitle("Hugs")
        .setColor("#f582ff")
        .setThumbnail("attachment://AnimeHug.gif")
        .setFooter(`Hugged by ${message.author.tag} | You should hug them back :)`, message.author.avatarURL());


    // Set Hug Gifs
    for (var i = 0; i < Object.keys(hug_gifs).length; i++) {
        console.log(Object.keys(hug_gifs)[i]);
        if (Object.keys(hug_gifs)[i] === message.author.id) {
            hug_gif = new Discord.MessageAttachment(`./Assets/Gifs/Hugs/${message.author.id}.gif`);
            Embed.setImage(`attachment://${message.author.id}.gif`);
            break;
        } else {
            hug_gif = null;
            Embed.setImage((await NekoAPI.sfw.hug()).url);
        }
    }

    if (message.mentions.users.size === 1) {
        // Single Hug
        Embed.setDescription(`${message.author} hugs ${message.mentions.users.first()}`)

        let context = {
            embeds: [Embed],
            files: [ICON]
        };

        if (hug_gif !== null) { context.files.push(hug_gif); }

        message.channel.send(context);

        message.mentions.users.forEach(user => {
            UserStats.LogUserStat(message.author, "HugsGiven", user);
            UserStats.LogUserStat(user, "HugsReceived", message.author);
        });
    } else if (message.mentions.users.size > 1) {
        // Multi Hug
        Embed.addField("Hugs to", Array.from(message.mentions.users.values()).join("\n"))

        let context = {
            embeds: [Embed],
            files: [ICON]
        };

        if (hug_gif !== null) { context.files.push(hug_gif); }

        message.channel.send(context);

        message.mentions.users.forEach(user => {
            UserStats.LogUserStat(message.author, "HugsGiven", user);
            UserStats.LogUserStat(user, "HugsReceived", message.author);
        });
    } else {
        if (message.attachments.size > 0) {
            if (message.attachments.first().name.split(".")[1] === "gif") {
                WebClient.DownloadFile(message.attachments.first().url, `./Assets/Gifs/Hugs/${message.author.id}.gif`, function () {
                    if (Object.keys(hug_gifs).includes(message.author.id)) {
                        hug_gifs[message.author.id]["Path"] = `./Assets/Gifs/Hugs/${message.author.id}.gif`;
                    } else {
                        hug_gifs[message.author.id] = {
                            "Tag": message.author.tag,
                            "Path": `./Assets/Gifs/Hugs/${message.author.id}.gif`
                        }
                    }

                    FileSystem.writeFileSync("./Assets/Data/HugGifs.json", JSON.stringify(hug_gifs, null, 2));

                    message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                                // .setTitle("Hugs")
                                .setColor("#f582ff")
                                .setThumbnail("attachment://AnimeHug.gif")
                                .setDescription(`Hug gif set`)
                        ]
                    });
                });
            }
        } else {
            if (["random", "remove", "removegif"].includes(args[1])) {
                for (var entry in hug_gifs) {
                    if (hug_gifs.entry.Tag === message.author.tag) {
                        FileSystem.unlinkSync(hug_gifs.entry.Path);
                        hug_gifs.splice(hug_gifs.indexOf(hug_gifs.entry), 1);
                    }
                }

                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            // .setTitle("Hugs")
                            .setColor("#f582ff")
                            .setThumbnail("attachment://AnimeHug.gif")
                            .setDescription(`Hug gif removed, a random gif will be used instead.`)
                    ]
                });
            } else {
                // Non User
                args.shift();

                Embed.setDescription(`${message.author} hugs ${args.join(" ")}`)

                let context = {
                    embeds: [Embed],
                    files: [ICON]
                };

                if (hug_gif !== null) { context.files.push(hug_gif); }

                message.channel.send(context);
            }
        }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "hug",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "hug" ]
    ],
    Run
}