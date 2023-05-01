import * as Discord from "discord.js";
import * as OpenAi from "openai";
import * as GoogleTts from "gtts";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../include/Utility.js";

const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

let conversations = new Map<string, Conversation>();

let settings = {
    text: {
        model: "gpt-4",
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

        // Text + Voice Response
        ["summonfakeawake3"],
        ["sfa3"]
    ],
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        argswithcase.shift();

        let response;
        var m: Discord.Message = await message.channel.send("<a:Loading:965027668280111255> thinking... (fa3 is unstable, consider using fa2 if this isn't working out)");

        try {
            // Handle conversation instances
            let channel_id = message.channel.id;
            if (!conversations.has(channel_id)) conversations.set(channel_id, new Conversation());
            conversations.get(channel_id).AddMessage({ role: "user", message: argswithcase.join(" ") });
            settings.text.messages = conversations.get(channel_id).GetMessages();

            response = await OPENAI_API.createChatCompletion(settings.text);
            if (response.data.choices[0].message != "") m.edit(response.data.choices[0].message.content); else message.edit("idk");

            conversations.get(channel_id).AddMessage({ role: response.data.choices[0].message.role, message: response.data.choices[0].message.content });

            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Begining of Response`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response: ${response.data.choices[0].message.content.replace("\n", "\\n")}`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] End of Response`);
        } catch (e) {
            m.edit("I broke, please try again. If I'm still broken then blame <@301985885870882827> >:)");

            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Begining of Response`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response: ${e}`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] End of Response`);
            return CommandHandler.ExitCode.InternalError;
        }

        return CommandHandler.ExitCode.Success;
    }
}