import * as Discord from "discord.js";
import * as FileSystem from "fs";
import * as Sharp from "sharp";
import * as WebClient from "../../include/WebClient.js";
import * as Utils from "../../include/Utils.js";

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {
    if (message.attachments.size < 1) {
        // send usage embed
        return true;
    }
    
    let url: string = message.attachments.first().url;
    let extention = url.split(".")[url.split(".").length - 1]
    await WebClient.DownloadFileAsync(url, `./Assets/temp/original.${extention}`);
    let image: Sharp.Sharp = Sharp.default(`./Assets/temp/original.${extention}`);

    for (var i = 0; i < args.length; i++) {
        switch (args[i]) {
            // Resizing
            case "-width":
                if (parseInt(args[i + 1], 10)) image.resize({ width: parseInt(args[i + 1], 10), fit: Sharp.fit.fill });
                break;

            case "-height":
                if (parseInt(args[i + 1], 10)) image.resize({ height: parseInt(args[i + 1], 10), fit: Sharp.fit.fill });
                break;

            // Image Operations
            case "-rotate":
                if (parseInt(args[i + 1], 10)) image.rotate(parseInt(args[i + 1], 10));
                break;

            case "-flip":
                image.flip();
                break;

            case "-flop":
                image.flop();
                break;

            case "-sharpen":
                if (parseFloat(args[i + 1])) image.sharpen(parseFloat(args[i + 1]));
                break;

            case "-blur":
                if (parseFloat(args[i + 1])) image.blur(parseFloat(args[i + 1]));
                break;

            case "-gamma":
                if (parseFloat(args[i + 1])) image.gamma(parseFloat(args[i + 1]));
                break;

            case "-negate":
                if (parseInt(args[i + 1], 10)) image.negate();
                break;

            case "-threshold":
                if (parseInt(args[i + 1], 10)) image.threshold(parseInt(args[i + 1], 10));
                break;

            case "-hueshift":
                if (parseFloat(args[i + 1])) image.modulate({ hue: parseFloat(args[i + 1]) });
                break;

            case "-saturation":
                if (parseFloat(args[i + 1])) image.modulate({ saturation: parseFloat(args[i + 1]) });
                break;

            case "-lightness":
                if (parseFloat(args[i + 1])) image.modulate({ lightness: parseFloat(args[i + 1]) });
                break;

            case "-brightness":
                if (parseFloat(args[i + 1])) image.modulate({ brightness: parseFloat(args[i + 1]) });
                break;

            case "-greyscale":
                image.greyscale();
                break;
        }
    }

    // Save and send image
    await image.toFile("./Assets/temp/edited.png");
    await message.channel.send({ attachments: [new Discord.MessageAttachment("./Assets/temp/edited.png")] });

    // Clean up files
    FileSystem.unlinkSync(`./Assets/temp/original.${extention}`);
    FileSystem.unlinkSync("./Assets/temp/edited.png");

    return true;
}

export const NSFW: boolean = false;
export const title: string = "ImageTools";
export const category: string = global.COMMAND_CATEGORIES.UTILITY.NAME;
export const aliases: string[][] = [
    ["editx"]
];