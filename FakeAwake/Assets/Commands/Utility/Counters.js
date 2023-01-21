const Discord = require("discord.js");
const FileSystem = require("fs");
const Status = require("../../include/Status.js");

const EMBED_BUTTONS = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId("increment")
            .setLabel("Increment")
            .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("decrement")
            .setLabel("Decrement")
            .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("set")
            .setLabel("Set")
            .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("reset")
            .setLabel("Reset")
            .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("delete")
            .setLabel("Delete")
            .setStyle("DANGER")
    );

var counters = { };

function ReadCounters() {
    return JSON.parse(FileSystem.readFileSync("./Assets/Data/Counters.json"));
}

function WriteCounters() {
    FileSystem.writeFileSync("./Assets/Data/Counters.json", JSON.stringify(counters, null, 2));
}

class Counter {
    id = 0;
    name = "";
    count = 0;

    static Create(message, args) {
        counters = ReadCounters();

        if (!Object.keys(counters).includes(message.guild.id)) counters[message.guild.id] = [];

        var temp = counters[message.guild.id];
        temp.push(new Counter(temp.length, args[2]));
        counters[message.guild.id] = temp;
        WriteCounters();
    }

    static Delete(message, args) {
        counters = ReadCounters();

        if (!Object.keys(counters).includes(message.guild.id)) {
            message.channel.send("You don't have any counters");
            return;
        }

        if ((parseInt(args[2]) || false) || args[2] === "0") {
            var temp = counters[message.guild.id];
            temp.splice(parseInt(args[2]), 1);
            for (var i = 0; i < temp.length; i++) temp[i]["id"] = i;
            counters[message.guild.id] = temp;
        } else {
            for (var counter in counters[message.guild.id]) {
                if (counters[message.guild.id][counter]["name"] === args[2]) {
                    var temp = counters[message.guild.id];
                    temp.splice(counter, 1);
                    for (var i = 0; i < temp.length; i++) temp[i]["id"] = i;
                    counters[message.guild.id] = temp;
                }
            }
        }

        if (Object.values(counters[message.guild.id]).length === 0) delete counters[message.guild.id];

        WriteCounters();
    }

    static Increment(message, args) {
        counters = ReadCounters();

        if (!Object.keys(counters).includes(message.guild.id)) {
            message.channel.send("You don't have any counters");
            return;
        }

        if ((parseInt(args[2]) || false) || args[2] === "0") {
            counters[message.guild.id][parseInt(args[2]) || 0]["count"] = counters[message.guild.id][parseInt(args[2]) || 0]["count"] + 1;
        } else {
            for (var counter in counters[message.guild.id]) {
                if (counters[message.guild.id][counter]["name"] === args[2]) {
                    counters[message.guild.id][counter]["count"] = counters[message.guild.id][counter]["count"] + 1;
                }
            }
        }

        WriteCounters();
    }

    static Decrement(message, args) {
        counters = ReadCounters();

        if (!Object.keys(counters).includes(message.guild.id)) {
            message.channel.send("You don't have any counters");
            return;
        }

        if ((parseInt(args[2]) || false) || args[2] === "0") {
            counters[message.guild.id][parseInt(args[2]) || 0]["count"] = counters[message.guild.id][parseInt(args[2]) || 0]["count"] - 1;
        } else {
            for (var counter in counters[message.guild.id]) {
                if (counters[message.guild.id][counter]["name"] === args[2]) {
                    counters[message.guild.id][counter]["count"] = counters[message.guild.id][counter]["count"] - 1;
                }
            }
        }

        WriteCounters();
    }

    static Set(message, args) {
        counters = ReadCounters();

        if (!Object.keys(counters).includes(message.guild.id)) {
            message.channel.send("You don't have any counters");
            return;
        }

        if ((parseInt(args[2]) || false) || args[2] === "0") {
            if ((parseInt(args[3]) || false) || args[3] === "0")
                counters[message.guild.id][parseInt(args[2]) || 0]["count"] = parseInt(args[3] || 0);
            else
                message.channel.send("Thats not a number silly (value is invalid)");
        } else {
            for (var counter in counters[message.guild.id]) {
                if (counters[message.guild.id][counter]["name"] === args[2]) {
                    if ((parseInt(args[3]) || false) || args[3] === "0")
                        counters[message.guild.id][parseInt(args[2]) || 0]["count"] = parseInt(args[3] || 0);
                    else
                        message.channel.send("Thats not a number silly (value is invalid)");
                }
            }
        }

        WriteCounters();
    }

    static Reset(message, args) {
        counters = ReadCounters();

        if (!Object.keys(counters).includes(message.guild.id)) {
            message.channel.send("You don't have any counters");
            return;
        }

        if ((parseInt(args[2]) || false) || args[2] === "0") {
            counters[message.guild.id][parseInt(args[2]) || 0]["count"] = 0;
        } else {
            for (var counter in counters[message.guild.id]) {
                if (counters[message.guild.id][counter]["name"] === args[2]) {
                    counters[message.guild.id][parseInt(args[2]) || 0]["count"] = 0;
                }
            }
        }

        WriteCounters();
    }

    static Embed(message, args) {
        counters = ReadCounters();
        counter = null;

        if (!Object.keys(counters).includes(message.guild.id)) {
            message.channel.send("You don't have any counters");
            return;
        }

        if ((parseInt(args[2]) || false) || args[2] === "0") {
            counter = counters[message.guild.id][parseInt(args[2]) || 0];
        } else {
            for (var counter in counters[message.guild.id]) {
                if (counters[message.guild.id][counter]["name"] === args[2]) {
                    counter = counters[message.guild.id][parseInt(args[2]) || 0];
                }
            }
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("Counters+")
            .setDescription([
                `Counter: \`${counter.name}\``,
                `ID: \`${counter.id}\``,
                `Count: \`${counter.count}\``
            ].join("\n"));

        var dropdown_options = [];

        for (var c of counters[message.guild.id]) dropdown_options.push({
            label: `[${c.id}] ${c.name}`,
            value: `${c.id}`
        });

        var embed_dropdown = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId("counter-select")
                    .setPlaceholder("Select Counter")
                    .addOptions(dropdown_options)
        );

        message.channel.send({ embeds: [embed], components: [EMBED_BUTTONS, embed_dropdown] });
    }

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

function Run(message, args, args_with_case, client) {
    switch (args[1]) {
        case "create":
            if (args[2]) { Counter.Create(message, args); message.channel.send(`Created counter \`${args[2]}\``); }
            else message.channel.send("`counter create <name>`");
            break;

        case "delete":
            if (args[2]) { Counter.Delete(message, args); message.channel.send(`Deleted counter \`${args[2]}\``); }
            else message.channel.send("`counter delete <name/id>`");
            break;

        case "increment":
            if (args[2]) { Counter.Increment(message, args); message.channel.send(`Incremented counter \`${args[2]}\``) }
            else message.channel.send("`counter increment <name/id>`");
            break;

        case "decrement":
            if (args[2]) { Counter.Decrement(message, args); message.channel.send(`Decrement counter \`${args[2]}\``) }
            else message.channel.send("`counter decrement <name/id>`");
            break;

        case "set":
            if (args[2] && args[3]) { Counter.Set(message, args); message.channel.send(`Set counter \`${args[2]}\` to \`${args[3]}\``) }
            else message.channel.send("`counter set <name/id> <value>`");
            break;

        case "reset":
            if (args[2]) { Counter.Reset(message, args); message.channel.send(`Reset counter \`${args[2]}\``) }
            else message.channel.send("`counter reset <name/id>`");
            break;

        case "view":
            if (args[2]) Counter.Embed(message, args);
            else message.channel.send("`counter view <name/id>`");
            break;

        default:
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("Counters+")
                        .setDescription([
                            "**Create Counter:** `counter create <name>`",
                            "**Delete Counter:** `counter delete <name/id>`",
                            "**Increment Counter:** `counter increment <name/id>`",
                            "**Decrement Counter:** `counter decrement <name/id>`",
                            "**Set Counter:** `counter set <name/id> <value>`",
                            "**Reset Counter:** `counter reset <name/id>`",
                            "**List Counters:** `counter list`"
                        ].join("\n"))
                ]
            });
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "counters",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        ["counter"],
        ["counters"]
    ],
    Run
}