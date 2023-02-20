function Run(message, args, args_with_case, client) {
    message.reply(`${message.author} blaze it!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "420",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "420" ]
    ],
    Run
}