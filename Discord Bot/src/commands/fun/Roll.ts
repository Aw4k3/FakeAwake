import * as Discord from "discord.js";
import * as CommandHandler from "../../CommandHandler.js";
import * as Random from "../../../helpers/Random.js";

export const command: CommandHandler.ICommand = {
    name: "Roll",
    category: "Fun",
    nsfw: false,
    aliases: [["roll"]],
    devMode: false,
    Run: function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): CommandHandler.ExitCode {
        let max = parseInt(args[1], 10) || 100;
        message.channel.send(`${message.author} rolled a ${Random.RandomInteger(0, max)}`);

        return CommandHandler.ExitCode.Success
    }
}