const AutosSettings = require("./AutoSettings.js");
const Utils = require("../../include/Utils.js");
const Neko = require("nekos.life");

const NekoClient = new Neko();

async function Run(message, args, args_with_case, client) {
    const config = AutosSettings.ReadConfig();

    if (config["ProfilePic"]["LastReminderDate"] !== Utils.GetDate("long")) {
        var image = await NekoClient.sfw.neko();
        client.user.setAvatar(image.url);
        config["ProfilePic"]["LastReminderDate"] = Utils.GetDate("long");
    }

    AutosSettings.WriteConfig(config);
}

module.exports = {
    NSFW: false,
    name: "set_avatar",
    aliases: [ [] ],
    Run
}