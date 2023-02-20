function Run(message, args, args_with_case, client) {
    message.channel.send("https://tenor.com/view/cbt-fire-cbt-professional-professional-cbt-gif-19523189");

    return true;
}

module.exports = {
    NSFW: true,
    name: "cbt",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "cbt" ]
    ],
    Run
}