const Discord = require("discord.js");
const Random = require("../../include/Random.js");
const AutosSettings = require("./AutoSettings.js");

const RESPONSES = [
    "Your bum appears to have been on your chair for more than 69 minutes, get up and go do some exercise!",
    "Move your bum or grow the tum*my*",
    "Do an exercise of your choosing.",
    "Do 10 or more pushups",
    "Do 10 or more squats",
    "Do 10 or more situps",
    "Remember to hydrate, also do some exercise.",
    "Try doing some stretches"
];

var notifications = [];

class Notifications {
    embed = new Discord.MessageEmbed()
        .setTitle("Health Check")
        .setDescription(RESPONSES[Random.RandInt(0, RESPONSES.length)])
        .addField("Next Ping", `<t:${Math.floor((Date.now() / 1000) + 4140)}:R> <t:${Math.floor((Date.now() / 1000) + 4140)}:t>`);

    buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId("snooze1")
                .setLabel("Snooze 1m")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("snooze3")
                .setLabel("Snooze 3m")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("snooze5")
                .setLabel("Snooze 5m")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("snooze10")
                .setLabel("Snooze 10m")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("snooze3")
                .setLabel("Snooze 15m")
                .setStyle("PRIMARY")
    );
}

function Run(message, args, args_with_case, client) {
    var x = 0;
    setInterval(() => {
        if (AutosSettings.ReadConfig().Exercise.Enabled) {
            // client.channels.cache.get("947824628808687616").send(`${RESPONSES[Random.RandInt(0, RESPONSES.length)]} (Next ping in <t:${Math.floor((Date.now() / 1000) + 4140)}:R> <t:${Math.floor((Date.now() / 1000) + 4140)}:t>)`);
            client.channels.cache.get("947824628808687616").send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("Health Check")
                        .setThumbnail("https://cdn.discordapp.com/attachments/816395712748453948/953082333219668019/Workout.jpg")
                        .setDescription(RESPONSES[Random.RandInt(0, RESPONSES.length)])
                        .addField("Next Ping", `<t:${Math.floor((Date.now() / 1000) + 4140)}:R> <t:${Math.floor((Date.now() / 1000) + 4140)}:t>`)
                ]
            });
            // client.channels.cache.get("706098244081680385").send(`${RESPONSES[Random.RandInt(0, RESPONSES.length)]} (Next ping in <t:${Math.floor((Date.now() / 1000) + 4140)}:R> <t:${Math.floor((Date.now() / 1000) + 4140)}:t>)`);
        }
    }, 4140000);
    // 4140000

    return true;
}

module.exports = {
    NSFW: false,
    name: "exercise",
    aliases: [ [] ],
    Run
}