function Run(message, args, args_with_case, client) {
    message.reply(`${message.author} nice!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "69",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "69" ]
    ],
    Run
}