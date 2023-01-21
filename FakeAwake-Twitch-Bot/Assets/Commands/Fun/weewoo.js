function Run(channel, tags, msg, self, client, args, args_with_case) {
    args_with_case.shift();
    client.say(channel, `${tags.username} sends ${args_with_case.join(' ')} to horny jail!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "weewoo",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["weewoo"]
    ],
    Run
}