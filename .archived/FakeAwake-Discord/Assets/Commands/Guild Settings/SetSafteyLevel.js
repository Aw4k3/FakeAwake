const Discord = require("discord.js");
const GuildSettings = require("../../include/GuildSettings.js");

function Run(message, args, args_with_case, client) {
    if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || message.author.id === "301985885870882827") {
        if (args[1] === "true") {
            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.SFW, true);
            message.channel.send(`SFW only set to \`${(args[1])}\``);
        } else if (args[1] === "false") {
            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.SFW, undefined);
            message.channel.send(`SFW only set to \`${(args[1])}\``);
        } else {
            message.channel.send(`value must be \`true\` or \`false\``);
        }
    } else {
        message.channel.send(`${message.author}, you're not a big man ting, you don't have permission to set the Safety Level for this server!`);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "setSFW",
    category: global.COMMAND_CATEGORIES.GUILD_SETTINGS.NAME,
    aliases: [
        [ "setsfw" ],
        [ "sfw" ]
    ],
    Run
}