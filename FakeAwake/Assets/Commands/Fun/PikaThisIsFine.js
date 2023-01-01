function Run(message, args, args_with_case, client) {
    message.channel.send("https://cdn.discordapp.com/attachments/845994270460739615/861372564584398888/BrowserPreview_tmp.gif");

    return true;
}

module.exports = {
    NSFW: false,
    name: "pikaThisIsFine",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "thisisfine" ],
        [ "tif" ]
    ],
    Run
}