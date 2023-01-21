const GuildSettings = require("../../include/GuildSettings.js");

var last_broadcast = [];

async function Run(message, args, args_with_case, client) {
    if (args[1] === "-undo") {
        for (let i = 0; i < last_broadcast.length; i++) {
            last_broadcast[i].delete();
        }

        return;
    }

    const GUILD_CONFIGS = GuildSettings.read_config();
    const MESSAGE = message.content.substring(args[0].length + 1);
    last_broadcast = [];
    if (message.author.id === "301985885870882827") {
        var counter = 0;

        for (var guild in GUILD_CONFIGS) {
            if (Object.keys(guild).includes(GuildSettings.PROPERTIES.BROADCAST_CHANNEL) != null) {
                try {
                    last_broadcast.push(await client.channels.cache.get(GuildSettings.GetProperty(guild, GuildSettings.PROPERTIES.BROADCAST_CHANNEL)).send(MESSAGE));
                    counter++;
                } catch (e) {
                    console.log(e);
                }
            }
        }

        message.reply(`Broadcasted to ${counter} servers.`);
    } else {
        message.channel.send(`${message.author}, only <@!301985885870882827>  can use this command.`);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "broadcast",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "bc" ],
        [ "broadcast" ]
    ],
    Run
}