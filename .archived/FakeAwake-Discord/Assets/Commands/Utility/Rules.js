// @ts-check
const Discord = require("discord.js");
const FileSystem = require("fs");
const GuildSettings = require("../../include/GuildSettings.js");

const EMOTE_NUMBERS = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:"
];

class Rules {
    use_emote_numbers = false;
    guild = null;
    rules = [];

    CompileRules(emote_numbers = false) {
        var list = [];
        if (emote_numbers) {
            for (var i = 0; i < this.rules.length; i++) {
                list.push(`${EMOTE_NUMBERS[i + 1]} ${this.rules[i]}`);
            }
        } else {
            for (var i = 0; i < this.rules.length; i++) {
                list.push(`${i + 1}. ${this.rules[i]}`);
            }
        }

        return list;
    }

    Send(channel) {
        channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle(`${this.guild.name} - Rules`)
                    .setThumbnail(this.guild.iconURL())
                    .setDescription(this.CompileRules().join("\n\n"))
                    .setFooter("Now be a good member and don't break these :)")
            ]
        });
    }

    constructor(guild) {
        if (GuildSettings.GetProperty(guild.id, GuildSettings.PROPERTIES.RULES) === null) return;
        this.guild = guild;
        this.rules = GuildSettings.GetProperty(guild.id, GuildSettings.PROPERTIES.RULES);
    }
}

function PermissionsCheck(message) {
    if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || message.author.id === "301985885870882827") {
        return true;
    } else {
        message.channel.send(`${message.author}, you're not a big man ting, you don't have permission to set the rules for this server!`);
        return false;
    }
}

function Run(message, args, args_with_case, client) {
    if (args_with_case.length === 1) {
        if (GuildSettings.GetProperty(message.guild.id, GuildSettings.PROPERTIES.RULES) === null) {
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle(`${message.guild.name} - Rules`)
                        .setThumbnail(message.guild.iconURL())
                        .setDescription([
                            "This server doesn't have a summonable rules page",
                            "Admins can set it up using",
                            "> rules add `<string:rule>`",
                            "> rules edit <int:index (from 1, not 0)> `<string:rule>`",
                            "> rules remove|delete `<int:index (from 1, not 0)>`",
                            "> rules remove_all|delete_all",
                            "> rules reorder `<int:index>` `<int:index>` `<int:index>`... (arranges in specified order, index starting from 1, not 0)"
                        ].join("\n"))
                        .setFooter("Summonable Rules :WOAH:")
                ]
            });
        } else {
            new Rules(message.guild).Send(message.channel);
        }

        return true;
    }


    if (PermissionsCheck(message)) {
        var instance = new Rules(message.guild);

        switch (args_with_case[1]) {
            case "help":
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Rules Setup Help")
                            .setDescription([
                                "> rules add `<string:rule>`",
                                "> rules remove|delete `<int:index (from 1, not 0)>`",
                                "> rules remove_all|delete_all",
                                "> rules reorder `<int:index>` `<int:index>` `<int:index>`... (arranges in specified order, index starting from 1, not 0)"
                            ].join("\n"))
                            .setFooter("Summonable Rules :WOAH:")
                    ]
                });
                break;

            case "add":
                args_with_case.shift();
                args_with_case.shift();

                if (args_with_case.length > 0) {
                    instance.rules.push(args_with_case.join(" "));
                    message.channel.send(`Added "${args_with_case.join(" ")}" to rules`);
                } else {
                    message.channel.send(`I see, you don't like rules ;)`);
                }
                break;

            case "edit":
                var index = 0;
                if (parseInt(args_with_case[2]) || false) {
                    if (parseInt(args_with_case[2]) > instance.rules.length) {
                        message.channel.send(`\`${args_with_case[2]}\` is greater than the number of rules you have`);
                        return true;
                    } else {
                        index = parseInt(args_with_case[2]) - 1;
                    }
                } else {
                    message.channel.send(`"${args_with_case[2]}" is a weird looking number`);
                    return true;
                }

                args_with_case.shift();
                args_with_case.shift();
                args_with_case.shift();

                if (args_with_case.length > 0) {
                    instance.rules[index] = args_with_case.join(" ");
                    message.channel.send(`Replaced rule ${index + 1} with "${args_with_case.join(" ")}"`);
                } else {
                    message.channel.send(`I see, you don't like rules ;)`);
                }
                break;

            case "reorder":
                args_with_case.shift();
                args_with_case.shift();

                if (args_with_case.length > 0) {
                    var order = [];
                    for (var arg of args_with_case) {
                        if (parseInt(arg) || false) {
                            if (parseInt(arg) > instance.rules.length) {
                                message.channel.send(`\`${arg}\` is greater than the number of rules you have`);
                                return true;
                            } else {
                                order.push(parseInt(arg) - 1);
                            }
                        } else {
                            message.channel.send(`"${arg}" is a weird looking number`);
                            return true;
                        }
                    }

                    var reordered = [];

                    for (var i = 0; i < instance.rules.length; i++) {
                        if (i < order.length) {
                            reordered.push(instance.rules[order[i]]);
                        } else {
                            reordered.push(instance.rules[i]);
                        }
                    }

                    instance.rules = reordered;
                    message.channel.send(`Rules have been re-ordered`);
                }
                break;

            case "remove":
            case "delete":
                if (parseInt(args_with_case[2]) || false) {
                    if (parseInt(args_with_case[2]) > instance.rules.length) {
                        message.channel.send(`\`${parseInt(args_with_case[2])}\` is greater than the number of rules you have`);
                        return true;
                    }

                    message.channel.send(`Removed "${instance.rules[parseInt(args_with_case[2]) - 1]}"`);
                    instance.rules = instance.rules.splice(parseInt(args_with_case[2]) - 1);
                    if (instance.rules.length === 0) instance.rules = undefined;
                } else {
                    message.channel.send(`"${args_with_case[2]}" is a weird looking number`);
                }
                break;

            case "remove_all":
            case "delete_all":
                instance.rules = undefined;
                message.channel.send(`Removed all rules`);
                break;
        }

        GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.RULES, instance.rules);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "rules",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        ["rules"]
    ],
    Run
}