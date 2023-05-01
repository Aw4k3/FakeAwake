import * as Discord from "discord.js";
import * as CommandHandler from "../../CommandHandler.js";
import * as Random from "../../../include/Random.js";
import * as Utility from "../../../include/Utility.js";

export const command: CommandHandler.ICommand = {
    name: "HowX",
    category: "Fun",
    nsfw: false,
    aliases: [["how"]],
    Run: function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): CommandHandler.ExitCode {
        if (argswithcase.length < 2) return CommandHandler.ExitCode.UsageError;

        let entries: string[] = [];
        let max = 100;
        let subject = "";

        if (message.content.includes("-overload")) max = Number.MAX_SAFE_INTEGER;

        // Clean up message content
        argswithcase.shift();
        subject = argswithcase.join(" ");
        subject = subject.replace(/<@[0-9]+>/g, ""); // Remove mentions

        // If message includes mentions
        if (message.mentions.users.size > 0)
            for (let user of message.mentions.users.values())
                entries.push(`${user}: ${Random.RandomInteger(0, max)}%`);
        // If message does not include mentions
        else
            entries.push(`${message.author}: ${Random.RandomInteger(0, max)}%`);

        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`${Utility.CapitiliseFirstLetter(subject)} Check`)
                    .setDescription(entries.join("\n"))
                    .setColor(Utility.COLOURS.PRIMARY as Discord.ColorResolvable)
            ]
        });

        return CommandHandler.ExitCode.Success
    }
}