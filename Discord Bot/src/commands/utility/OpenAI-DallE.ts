import * as Discord from "discord.js";
import * as OpenAi from "openai";
import * as FileSystem from "fs";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../include/Utility.js";
import * as WebClient from "../../../include/WebClient.js";

const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

let settings = {
    prompt: "",
    n: 1,
    size: "1024x1024"
}

export const command: CommandHandler.ICommand = {
    name: "OpenAI-DallE",
    category: "Utility",
    nsfw: false,
    aliases: [
        ["fakeawake2i"],
        ["fa2i"],
        ["fakeawakei"],
        ["fai"]
    ],
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        argswithcase.shift();
        settings.prompt = argswithcase.join(" ");
        var m: Discord.Message = await message.channel.send("<a:Loading:965027668280111255> generating...");

        try {
            let response = await OPENAI_API.createImage(settings as OpenAi.CreateImageRequest);
            await WebClient.DownloadFile(response.data.data[0].url, "./temp/openai_result.png");
            m.edit("<a:Loading:965027668280111255> uploading...");
            await message.channel.send({ files: [new Discord.AttachmentBuilder("temp/openai_result.png")] });
            await FileSystem.unlinkSync("./temp/openai_result.png");
            m.delete();
        } catch (e) {
            m.edit(`Internal Error`);
            console.log(`${Utility.GenerateTimestamp()} ${e}`);
            return CommandHandler.ExitCode.InternalError;
        }

        return CommandHandler.ExitCode.Success;
    }
}