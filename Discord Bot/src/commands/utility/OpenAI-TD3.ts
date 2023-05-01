import * as Discord from "discord.js";
import * as OpenAi from "openai";
import * as GoogleTts from "gtts";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../include/Utility.js";

const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

let settings = {
    model: "text-davinci-003",
    prompt: "",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1.0,
    frequency_penalty: 0.6,
    presence_penalty: 0.3
}

export const command: CommandHandler.ICommand = {
    name: "OpenAI-TD3",
    category: "Utility",
    nsfw: false,
    aliases: [
        // Text Response
        ["fakeawake2"],
        ["fa2"],

        // Text + Voice Response
        ["summonfakeawake2"],
        ["sfa2"]
    ],
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        argswithcase.shift();

        let response;
        settings.prompt = argswithcase.join(" ");
        var m: Discord.Message = await message.channel.send("<a:Loading:965027668280111255> thinking...");

        try {
            response = await OPENAI_API.createCompletion(settings as OpenAi.CreateCompletionRequest);
            if (response.data.choices[0].text != "") m.edit(response.data.choices[0].text); else message.edit("idk");
        } catch (e) {
            m.edit(`Status: ${e.response.status}, ${e.response.statusText}`);
            return CommandHandler.ExitCode.InternalError;
        }

        console.log(`${Utility.GenerateTimestamp()} [OpenAI] Begining of Response`);
        console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response: ${response.data.choices[0].text.replace("\n", "\\n")}`);
        console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
        console.log(`${Utility.GenerateTimestamp()} [OpenAI] End of Response`);

        return CommandHandler.ExitCode.Success;
    }
}