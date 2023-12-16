import * as Discord from "discord.js";
import * as CommandHandler from "../../CommandHandler.js";
import * as Random from "../../../helpers/Random.js";

export const command: CommandHandler.ICommand = {
    name: "8Ball",
    category: "Fun",
    nsfw: false,
    aliases: [["8ball"]],
    devMode: false,
    Run: function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): CommandHandler.ExitCode {


        return CommandHandler.ExitCode.Success
    }
}