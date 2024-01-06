const Discord = require("discord.js");
const GuildSettings = require("../../include/GuildSettings.js");

function Run(message, args, args_with_case, client) {
    if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || message.author.id === "301985885870882827") {
        if (Array.from(message.mentions.channels.values()).length > 0) {
            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.BOT_CHANNELS, Array.from(message.mentions.channels.values()));
        } else {
            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.BOT_CHANNELS, undefined);
        }
        message.channel.send(`Bot Channels set to ${Array.from(message.mentions.channels.values()).join(", ") || `\`Global\``}`);
    } else {
        message.channel.send(`${message.author}, you're not a big man ting, you don't have permission to set the bot channels for this server!`);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "setBotChannels",
    category: global.COMMAND_CATEGORIES.GUILD_SETTINGS.NAME,
    aliases: [
        [ "bc" ],
        [ "bcs" ],
        [ "botchannel" ],
        [ "botchannels" ],
        [ "setbotchannel" ],
        [ "setbotchannels" ]
    ],
    Run
}