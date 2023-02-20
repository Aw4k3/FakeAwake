function Run(channel, tags, msg, self, client, args, args_with_case) {
    client.say(channel, `@${tags.username} blaze it!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "420",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["420"]
    ],
    Run
}