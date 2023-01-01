const Discord = require("discord.js");
const GuildSettings = require("../../include/GuildSettings.js");

function Run(message, args, args_with_case, client) {
    if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || message.author.id === "301985885870882827") {
        GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.PREFIX, args[1]);
        message.channel.send(`Prefix set to \`${args[1] || ". (reset to default)"}\``);
    } else {
        message.channel.send(`${message.author}, you're not a big man ting, you don't have permission to set the prefix for this server!`);
    }

    return true;

}
module.exports = {
    NSFW: false,
    name: "setPrefix",
    category: global.COMMAND_CATEGORIES.GUILD_SETTINGS.NAME,
    aliases: [
        [ "prefix" ],
        [ "setprefix" ]
    ],
    Run
}