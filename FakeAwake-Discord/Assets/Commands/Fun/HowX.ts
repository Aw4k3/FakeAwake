import * as Discord from "discord.js";
import * as Random from "../../include/Random.js";
import * as Utils from "../../include/Utils.js";

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {
    var entries: string[] = [];
    var max = 101; // 101 becuase random function's upper limit is exclusive

    if (message.content.includes("-overload")) max = Number.MAX_SAFE_INTEGER;

    // Clean up
    if (args[0] == "how") argswithcase.shift();
    var subject: string = argswithcase.join(" ");
    subject = subject.replace(/<@[0-9]+>/g, ""); // Remove mentions
    subject = subject.replace(/ +/g, ""); // Fix spaces
    if (subject.startsWith("how")) subject = subject.substr(3); // Remove "how" if it exists

    // If there were users mentioned in the command
    if (message.mentions.members.size > 0)
        for (var member of Array.from(message.mentions.members.values()))
            entries.push(`${member}: ${Random.RandInt(0, max)}%`);

    // If no users mentioned in the command
    else
        entries.push(`${message.member}: ${Random.RandInt(0, max)}%`);

    let embed = new Discord.MessageEmbed()
        .setTitle(`${Utils.CapitilizeFirstLetter(subject)} Check`)
        .setColor("#000000")
        .setDescription(entries.join("\n"));

    message.channel.send({
        embeds: [embed]
    });

    return true;
}

export const NSFW: boolean = false;
export const title: string = "howX";
export const category: string = global.COMMAND_CATEGORIES.FUN.NAME;
export const aliases: string[][] = [
    ["how"]
];