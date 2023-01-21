const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Utils = require("../../include/Utils.js");
const FileSystem = require("fs");
const Chroma = require("chroma-js");

const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

function createEmbed(User) {
    var JObject = JSON.parse(FileSystem.readFileSync("./Assets/Data/me.json"));

    var Entries = [
        `**User Tag:** ||${User.user.tag}||`,
        `**Cake Day (Account):** ${User.user.createdAt}`,
        `**Is Bot:** ${User.user.bot}`,
        // `**Presence:** ${Utils.CapitilizeFirstLetter(User.presence.status)}`,
        `**Nickname (here):** ${User.user}`,
        `**Join Date (here)**: ${User.joinedAt}`,
        `**-------------------------------------**`
    ];

    var embed = new Discord.MessageEmbed()
        .setTitle(`Stalking ${User.user.username}"s Infos`)
        .setColor("#ffffff")
        .setThumbnail(User.user.avatarURL())
        .setFooter("Look at this hottie! Type '.me help' to see available custom fields you can add");

    if (JObject.hasOwnProperty(User.id)) {
        for (let i = 0; i < Object.keys(JObject[User.id]).length; i++) {
            if (JObject[User.id][Object.keys(JObject[User.id])[i]] === "") {
                delete JObject[User.id][Object.keys(JObject[User.id])[i]];
                FileSystem.writeFileSync("./Assets/Data/me.json", JSON.stringify(JObject, null, 2));
            } else {
                Entries.push(`**${Object.keys(JObject[User.id])[i]}:** ${JObject[User.id][Object.keys(JObject[User.id])[i]]}`)
            }
        }
    }

    Entries.push(`**Roles (here):** ${Array.from(User.roles.cache.values()).toString()}`);

    embed.setDescription(Entries.join("\n"));

    if (JObject.hasOwnProperty(User.id)) {
        if (JObject[User.id].hasOwnProperty("EmbedStripColor")) {
            embed.setColor(JObject[User.id]["EmbedStripColor"]);
        }
    } else {
        embed.setColor("#ffffff");
    }

    return embed;
}

function AddToMe(message, args, argsWithCase) {
    var JObject = JSON.parse(FileSystem.readFileSync("./Assets/Data/me.json"));
    if (!JObject.hasOwnProperty(message.author.id)) { JObject[message.author.id] = JSON.parse(`{}`); }
    var updatedFields = [];

    var Info = args[0];
    args.shift();
    argsWithCase.shift();

    switch (Info) {
        case "color":
        case "colour":
            var ResovledColor;
            switch (args[0]) {
                case "rgb":
                    if (args.length > 2) { ResovledColor = Chroma.rgb(args[1] || 0, args[2] || 0, args[3] || 0); }
                    break;


                case "hsv":
                    if (args.length > 2) { ResovledColor = Chroma.rgb(args[1] || 0, args[2] || 0, args[3] || 0); }
                    break;


                case "hex":
                    if (args.length > 0) { ResovledColor = Chroma.hex(args[1]) }
                    break;
            }
            JObject[message.author.id]["EmbedStripColor"] = ResovledColor.hex();
            updatedFields.push("Embed Strip Color");
            break;

        case "bio":
            JObject[message.author.id]["Bio"] = argsWithCase.join(" ");
            updatedFields.push("Bio");
            break;

        case "birthday": {
            const birthdayJSON = new Date(args.join(" "));
            if (args.length > 2) {
                JObject[message.author.id]["Birthday"] = `||${birthdayJSON.getDate()} ${Months[birthdayJSON.getMonth()]} ${birthdayJSON.getFullYear()}||`;
            } else {
                JObject[message.author.id]["Birthday"] = `||${birthdayJSON.getDate()} ${Months[birthdayJSON.getMonth()]}||`;
            }
            updatedFields.push("Birthday");
            break;
        }

        case "country":
            JObject[message.author.id]["Country"] = `||${argsWithCase.join(" ")}||`;
            updatedFields.push("Country");
            break;

        case "pronoun":
        case "pronouns":
            JObject[message.author.id]["Pronouns"] = `||${argsWithCase.join(" ")}||`;
            updatedFields.push("Pronouns");
            break;

        case "scoresaber":
        case "sb":
            JObject[message.author.id]["Scoresaber"] = argsWithCase.join(" ").split("&")[0];
            updatedFields.push("Scoresaber");
            break;

        case "timezone":
            JObject[message.author.id]["Timezone"] = `||${argsWithCase.join(" ")}||`;
            updatedFields.push("Timezone");
            break;

        case "twitch":
            JObject[message.author.id]["Twitch"] = argsWithCase.join(" ");
            updatedFields.push("Twitch");
            break;

        case "youtube":
            JObject[message.author.id]["Youtube"] = argsWithCase.join(" ");
            updatedFields.push("Youtube");
            break;
    }

    FileSystem.writeFileSync("./Assets/Data/me.json", JSON.stringify(JObject, null, 2));
    if (updatedFields.length > 0) {
        message.reply(`Updated fields ${updatedFields}.`);
    }
}

function Run(message, args, args_with_case, client) {
    if (args[1] === "help") {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Stalk Me :)")
                    .setColor(Status.StatusColor("OK"))
                    .setDescription("Following options followed by what you want to set it to.\ni.e .bio some text\nLeave text blank to remove a field.")
                    .addFields(
                        { name: ":gear: Adding Custom Fields to Me", value: "`bio` `birthday|bday` `color rgb|hsv|hex` `country` `scoresaber` `pronouns` `timezone` `twitch` `youtube`" }
                    )
                    .setFooter("Commands List")
            ]
        });
    } else {
        if (message.mentions.members.size) { // Get mentions infos
            message.mentions.members.forEach(user => {
                message.channel.send({ embeds: [createEmbed(user)] });
            });
        } else {
            message.channel.send({ embeds: [createEmbed(message.member)] });
        }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "me",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "me" ]
    ],
    Run,
    AddToMe
}