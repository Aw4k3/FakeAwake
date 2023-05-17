import * as Discord from "discord.js";
import * as CommandHandler from "../../CommandHandler.js";
import * as GuildSettings from "../../../include/GuildSettings.js";

export const command: CommandHandler.ICommand = {
    name: "Music Player",
    category: "Utility",
    nsfw: false,
    aliases: [["play"]],
    Run: function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): CommandHandler.ExitCode {
        if (args.length < 2) {
            message.channel.send(`${message.author}, Usage ${GuildSettings.GetPrefix(message.guildId)}play <string:url>`)
            return CommandHandler.ExitCode.UsageError;
        }

        message.channel.send("Feature has not been implemented yet");

        return CommandHandler.ExitCode.Success
    }
}