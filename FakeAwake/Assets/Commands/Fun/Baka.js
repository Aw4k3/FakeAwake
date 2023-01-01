function Run(message, args, args_with_case, client) {
    message.reply(`${message.author}, no you're a ${args[0]}!`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "baka",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "baka" ]
    ],
    Run
}