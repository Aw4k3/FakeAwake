function Run(message, args, args_with_case, client) {
    message.channel.send(`https://beatsaver.com/maps/${args[1] || "you_forgor_the_bsr_code_silly"}`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "maplink",
    category: global.COMMAND_CATEGORIES.BEAT_SABER.NAME,
    aliases: [
        [ "bsr" ]
    ],
    Run
}