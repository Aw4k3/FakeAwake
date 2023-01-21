function Run(message, args, args_with_case, client) {
    message.channel.send(`https://cdn.discordapp.com/attachments/816395712748453948/955537283258417182/be571c47c3a31219.gif`);

    return true;
}

module.exports = {
    NSFW: false,
    name: ":D",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [":d"]
    ],
    Run
}