const Discord = require("discord.js");
const FileSystem = require("fs");

const JObject = JSON.parse(FileSystem.readFileSync("./Assets/Data/UserStats.json", "utf8"));

class StatObject {
    Key = "";
    Value = 0;

    constructor(k, v) {
        this.Key = k;
        this.Value = v;
    }
}

function SpaceCaps(s) {
    var ss = "";
    for (var i = 0; i < s.length; i++) {
        if (/[A-Z]/.test(s[i])) {
            ss += ` ${s[i]}`;
        }
        else {
            ss += s;
        }
    }

    return ss;
}

function CreateEmbed(user, detailed = false) {
    console.log(`[File System] Read ./Assets/Data/UserStats.json`);
    var Fields = [];
    // Push user mention
    Fields.push(user);

    if (detailed) {
        // Push Entries
        for (let Stat in JObject[user.id]) {
            // For each stat
            if (Stat !== "User") {
                Fields.push(`**${Stat}**`);

                var SortingList = [];
                let total = 0;

                for (let i = 0; i < Object.keys(JObject[user.id][Stat]).length; i++) {
                    // Push each key and value a given stat to a sorting array
                    SortingList.push(new StatObject(Object.keys(JObject[user.id][Stat])[i], JObject[user.id][Stat][Object.keys(JObject[user.id][Stat])[i]]));
                    total += JObject[user.id][Stat][Object.keys(JObject[user.id][Stat])[i]];
                }

                // Sort the list
                var swapmade = true;

                while (swapmade) {
                    swapmade = false;
                    for (let i = 0; i < SortingList.length - 1; i++) {
                        if (SortingList[i].Value < SortingList[i + 1].Value) {
                            var temp = SortingList[i];
                            SortingList[i] = SortingList[i + 1];
                            SortingList[i + 1] = temp;
                            swapmade = true;
                        }
                    }
                }

                SortingList.reverse();
                SortingList.push(new StatObject("Total", total));
                SortingList.reverse();

                // Push to main Fields array
                for (let i = 0; i < SortingList.length; i++) {
                    if (SortingList[i].Key !== "Total") {
                        Fields.push(`> <@${SortingList[i].Key}>: ${SortingList[i].Value}`)
                    } else {
                        Fields.push(`> ${SortingList[i].Key}: ${SortingList[i].Value}`)
                    }
                }
            }
        }
    } else {
        for (let Stat in JObject[user.id]) {
            if (Stat !== "User") {
                let total = 0;
                for (let i = 0; i < Object.keys(JObject[user.id][Stat]).length; i++) {
                    total += JObject[user.id][Stat][Object.keys(JObject[user.id][Stat])[i]];
                }
                Fields.push(`**${Stat}:** ${total}`);
            }
        }
    }

    return new Discord.MessageEmbed()
        .setTitle("Stats")
        .setDescription(Fields.join("\n"))
        .setColor("#ffffff")
        .setThumbnail(user.avatarURL())
        .setFooter("Heard you like stats :)");
}

function Run(message, args, args_with_case, client) {

    const MaybeOptimizeThisLaterIDK = [
        "breakdown",
        "extended",
        "more",
        "details",
        "detailed",
        "detail"
    ]

    if (message.mentions.users.size > 0) { // Read someone elses stats
        message.mentions.users.forEach(user => {
            if (MaybeOptimizeThisLaterIDK.includes(args[1])) {
                message.channel.send({ embeds: [CreateEmbed(user, true)] });
            } else {
                message.channel.send({ embeds: [CreateEmbed(user)] });
            }
        });
    } else {
        if (MaybeOptimizeThisLaterIDK.includes(args[1])) {
            message.channel.send({ embeds: [CreateEmbed(message.author, true)] });
        } else {
            message.channel.send({ embeds: [CreateEmbed(message.author)] });
        }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "getUserStats",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "stats" ]
    ],
    Run
}