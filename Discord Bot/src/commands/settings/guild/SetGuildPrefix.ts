import * as Discord from "discord.js";
import * as CommandHandler from "../../../CommandHandler.js";
import * as GuildSettings from "../../../../include/GuildSettings.js";

export const command: CommandHandler.ICommand = {
    name: "SetGuildPrefix",
    category: "Settings",
    nsfw: false,
    aliases: [["prefix"], ["set", "prefix"]],
    Run: function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): CommandHandler.ExitCode {
        if (argswithcase.length < 2) return CommandHandler.ExitCode.UsageError; // args = [ "prefix", "<string>" ]
        if (argswithcase[1] == "") return CommandHandler.ExitCode.UsageError;

        GuildSettings.SetPrefix(message.guildId, argswithcase[1]);

        return CommandHandler.ExitCode.Success
    }
}