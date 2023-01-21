const Discord = require('discord.js');

function Run(message, args, args_with_case, client) {
    if (args[1]) {
        message.channel.send(`${args[1]}\n:black_small_square:${args[1]}${args[1]}${args[1]}${args[1]}\n${args[1]}`)
    }

    return true;
}

module.exports = {
    NSFW: true,
    name: 'makepp',
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "pp" ],
        [ "makepp" ]
    ],
    Run
}