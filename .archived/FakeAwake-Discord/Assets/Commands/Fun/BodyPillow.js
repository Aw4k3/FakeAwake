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

function Run(message, args, args_with_case, client) {
    var url = "";
    var zoom = 1.0;
    var blend_mode = null;

    if (message.attachments.size) {
        url = message.attachments.first().url
    } else if (message.mentions.users.size) {
        url = message.mentions.users.first().avatarURL({ size: 256 }) || message.mentions.users.first().defaultAvatarURL;
    } else {
        url = message.author.avatarURL({ size: 256 }) || message.author.defaultAvatarURL
    }

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
                    message.channel.send(`${message.author}, you can find a list of blending modes at https://sharp.pixelplumbing.com/api-composite`);
                }
                break;
        }
        if (/([0-9]+x)|([0-9]+\.+[0-9]+x)/.test(args[i])) {
            zoom = parseFloat(args[i]);
        }
    }

    /*********** Download Image ***********/
    console.log(`${Utils.GetTimeStamp()} [Download] Downloading ${url}`);
    WebClient.DownloadFile(url, `./Assets/temp/BodyPillow/pillowart.${extension}`, async function () {
        console.log(`${Utils.GetTimeStamp()} [Download] Downloaded ${url}`);

        // Zoom, Crop and Desaturate
        var art = await Sharp(`./Assets/temp/BodyPillow/pillowart.${extension}`)
            .resize(parseInt(121 * zoom), parseInt(428 * zoom),
                {
                    fit: Sharp.fit.fill
                })
            .extract({
                top: parseInt(((27 * zoom) / 2) - 13),
                left: parseInt(((27 * zoom) / 2) - 13),
                width: 121,
                height: 428
            })
            .toBuffer()
            .catch(err => console.log(`${Utils.GetTimeStamp()} [Body Pilow: Zoom, Crop, Desat Fail] ${err}`));

        // Place art onto coffee
        var comp = {
            input: art,
            gravity: Sharp.gravity.center
        }

        if (blend_mode !== null) comp.blend = blend_mode;
        await Sharp("./Assets/temp/BodyPillow/BlankBodyPillow.png")
            .composite([
                comp,
                { input: "./Assets/temp/BodyPillow/BodyPillowShading.png", blend: "darken" }
            ])
            .toFile("./Assets/temp/BodyPillow/export.png")
            .catch(err => console.log(`${Utils.GetTimeStamp()} [BodyPillow::Sharp] ${err}`));

        await message.channel.send({ files: [new Discord.MessageAttachment(`./Assets/temp/BodyPillow/export.png`)] });
    });

    return true;
}

module.exports = {
    NSFW: false,
    name: "bodypillow",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "bodypillow" ],
        [ "bp" ]
    ],
    Run
}