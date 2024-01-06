const Discord = require("discord.js");
const GuildSettings = require("../../include/GuildSettings.js");

function Run(message, args, args_with_case, client) {
    if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || message.author.id === "301985885870882827") {
        if (Array.from(message.mentions.channels.values()).length > 0) {
            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.BROADCAST_CHANNEL, Array.from(message.mentions.channels.values())[0]);
        } else {
            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.BROADCAST_CHANNEL, undefined);
        }
        message.channel.send(`Broadcast Channels set to ${Array.from(message.mentions.channels.values())[0] || `\`none\``}`);
    } else {
        message.channel.send(`${message.author}, you're not a big man ting, you don't have permission to set the bot channels for this server!`);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "setBroadcastChannel",
    category: global.COMMAND_CATEGORIES.GUILD_SETTINGS.NAME,
    aliases: [
        [ "broadcastchannel" ],
        [ "bcc" ],
        [ "setbroadcastchannel" ]
    ],
    Run
}