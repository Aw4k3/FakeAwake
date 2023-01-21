function Run(channel, tags, msg, self, client, args, args_with_case) {
    client.say(channel, `@${tags.username} nice!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "69",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["69"]
    ],
    Run
}