function Run(channel, tags, msg, self, client, args, args_with_case) {
    args.shift();
    client.say(channel, `@${tags.username} bonks ${args.join(' ')}!`)

    return true;
}

module.exports = {
    NSFW: false,
    name: "bonk",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["bonk"]
    ],
    Run
}