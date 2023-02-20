function Run(channel, tags, msg, self, client, args, args_with_case) {
    args.shift();
    client.say(channel, `${tags.username} hugs ${args.join(' ')}`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "hug",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["hug"]
    ],
    Run
}