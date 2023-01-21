const Discord = require("discord.js");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");
const Sharp = require("sharp");

const BLEND_MODES = [
    "clear",
    "source",
    "over",
    "in",
    "out",
    "dest-atop",
    "xor",
    "add",
    "saturate",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "colour-dodge",
    "color-dodge",
    "colour-burn",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion"
]

const BLEND_ALIASES = [
    "blend",
    "blendmode",
    "blend-mode",
    "bm",
    "-blend",
    "-blendmode",
    "-blend-mode",
    "-bm"
]

async function Run(message, args, args_with_case, client) {
    var url = "";
    var zoom = 1.0;
    var blend_mode = "color-burn";

    var message = await message.channel.send("Brewing Coffee <a:Cawfee:907465483924672543>");

    if (message.attachments.size) url = message.attachments.first().url;
    else if (message.mentions.users.size) url = message.mentions.users.first().avatarURL({ size: 256 }) || message.mentions.users.first().defaultAvatarURL;
    else url = message.author.avatarURL({ size: 256 }) || message.author.defaultAvatarURL;

    var extension = url.split(".")[url.split(".").length - 1].replace("?size=256", "");

    for (var i = 0; i < args.length; i++) {

        switch (true) {
            case /([0-9]+x)|([0-9]+\.+[0-9]+x)/.test(args[i]):
                zoom = parseFloat(args[i]);
                break;

            case (BLEND_ALIASES.includes(args[i])):
                if (BLEND_MODES.includes(args[i + 1])) {
                    blend_mode = args[i + 1];
                } else {
                    message.edit(`${message.author}, you can find a list of blending modes at https://sharp.pixelplumbing.com/api-composite`);
                }
                break;
        }
        if (/([0-9]+x)|([0-9]+\.+[0-9]+x)/.test(args[i])) {
            zoom = parseFloat(args[i]);
        }
    }

    /*********** Download Image ***********/
    console.log(`${Utils.GetTimeStamp()} [Download] Downloading ${url}`);
    WebClient.DownloadFile(url, `./Assets/Images/CoffeeArt/coffeeart.${extension}`, async function () {
        console.log(`${Utils.GetTimeStamp()} [Download] Downloaded ${url}`);

        // Zoom, Crop and Desaturate
        var art = await Sharp(`./Assets/Images/CoffeeArt/coffeeart.${extension}`)
            .resize({
                width: parseInt(285 * zoom),
                height: parseInt(285 * zoom)
            })
            .extract({
                top: parseInt(((285 * zoom) / 2) - 142),
                left: parseInt(((285 * zoom) / 2) - 142),
                width: 285,
                height: 285
            })
            .modulate({
                saturation: 0.1
            })
            .composite([
                {
                    input: `./Assets/Images/CoffeeArt/CoffeeTopDownMask.png`,
                    blend: "dest-in"
                }
            ])
            .toBuffer()
            .catch(err => console.log(`${Utils.GetTimeStamp()} [CoffeeArt::Sharp] ${err}`));

        // Place art onto coffee
        await Sharp(`./Assets/Images/CoffeeArt/CoffeeTopDown.png`) 
            .composite([
                {
                    input: art,
                    gravity: Sharp.gravity.center,
                    blend: blend_mode
                }
            ])
            .toFile(`./Assets/Images/CoffeeArt/export.png`)
            .catch(err => console.log(`${Utils.GetTimeStamp()} [CoffeeArt::Sharp] ${err}`));

        await message.delete();
        await message.channel.send({ files: [new Discord.MessageAttachment(`./Assets/Images/CoffeeArt/export.png`)] });
    });

    return true;
}

module.exports = {
    NSFW: false,
    name: "coffeeArt",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "coffeeart" ],
        [ "cf" ],
        [ "cfa" ],
        [ "ca" ]
    ],
    Run
}