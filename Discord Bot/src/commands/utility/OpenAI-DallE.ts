import * as Discord from "discord.js";
import * as OpenAi from "openai";
import * as GoogleTts from "gtts";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../include/Utility.js";

export const command: CommandHandler.ICommand = {
    name: "OpenAI-DallE",
    category: "Utility",
    nsfw: false,
    aliases: [
        ["fakeawakei"],
        ["fai"]
    ],
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {

        return CommandHandler.ExitCode.Success;
    }
}