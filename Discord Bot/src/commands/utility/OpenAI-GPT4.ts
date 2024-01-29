import * as Discord from "discord.js";
import * as OpenAi from "openai";
import * as GoogleTts from "gtts";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../helpers/Utility.js";

const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

let conversations = new Map<string, Conversation>();

let settings = {
    text: {
        model: "gpt-4",
        max_tokens: 164,
        messages: []
    },
    image: {
        prompt: "",
        n: 1,
        size: "1024x1024"
    }
}

interface Message {
    role: OpenAi.ChatCompletionRequestMessageRoleEnum;
    message: string;
}

class Conversation {
    static MESSAGE_LIFETIME = 600; // Seconds
    static MESSAGE_HISTORY_SIZE = 15;
    static IDENTITY: OpenAi.ChatCompletionRequestMessage = { role: "system", content: "Your name is FakeAwake. You are a really smart person." };
    private messages: Message[] = [];
    private timers: NodeJS.Timeout[] = [];

    AddMessage(message: Message): void {
        this.messages.push(message);
        this.timers.push(setTimeout(() => this.messages.splice(0, 1), Conversation.MESSAGE_LIFETIME * 1000));

        if (this.messages.length > Conversation.MESSAGE_HISTORY_SIZE) {
            this.messages.splice(0, 1);
            clearTimeout(this.timers[0]);
        }
    }

    GetMessages(): OpenAi.ChatCompletionRequestMessage[] {
        let messages: OpenAi.ChatCompletionRequestMessage[] = [ Conversation.IDENTITY ];
        for (let m of this.messages) messages.push({ role: m.role, content: m.message });
        return messages;
    }
}

export const command: CommandHandler.ICommand = {
    name: "OpenAI-GPT4",
    category: "Utility",
    nsfw: false,
    aliases: [
        // Text Response
        ["fakeawake3"],
        ["fa3"],
        ["fakeawake"],
        ["fa"],

        // Text + Voice Response
        ["summonfakeawake3"],
        ["sfa3"]
    ],
    devMode: false,
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        if (args[0] == "fakeawake3" || args[0] == "fa3") {
            message.channel.send(".fa3 (or .fakeawake3) has been changed to just .fa (or .fakeawake)");
            return;
        }

        argswithcase.shift();

        let response;
        var m: Discord.Message = await message.channel.send("<a:Loading:965027668280111255> thinking...");

        try {
            // Handle conversation instances
            let channel_id = message.channel.id;
            if (!conversations.has(channel_id)) conversations.set(channel_id, new Conversation());
            conversations.get(channel_id).AddMessage({ role: "user", message: argswithcase.join(" ") });
            settings.text.messages = conversations.get(channel_id).GetMessages();

            response = await OPENAI_API.createChatCompletion(settings.text);
            let responseMessage = response.data.choices[0].message;
            if (responseMessage.content !== "") m.edit(responseMessage.content); else message.edit("idk");

            conversations.get(channel_id).AddMessage({ role: responseMessage.role, message: responseMessage.content });

            CommandHandler.Log(`[OpenAI] Begining of Response`);
            CommandHandler.Log(`[OpenAI] Response: ${responseMessage.content.replace("\n", "\\n")}`);
            CommandHandler.Log(`[OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
            CommandHandler.Log(`[OpenAI] End of Response`);
        } catch (e) {
            m.edit("I broke, please try again. If I'm still broken then blame <@301985885870882827> >:)");

            CommandHandler.Log(`[OpenAI] Begining of Response`);
            CommandHandler.Log(`[OpenAI] Response: ${e}`);
            CommandHandler.Log(`[OpenAI] End of Response`);
            return CommandHandler.ExitCode.InternalError;
        }

        return CommandHandler.ExitCode.Success;
    }
}