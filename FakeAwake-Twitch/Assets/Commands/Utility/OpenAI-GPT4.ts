import * as OpenAi from "openai";
import * as FileSystem from "fs";
import * as Twitch from "tmi.js";
const Utils = require("../../include/Utils.js");

const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

let conversations = new Map<string, Conversation>();

let settings = {
    text: {
        model: "gpt-4",
        messages: [],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    }
}

interface Message {
    role: OpenAi.ChatCompletionRequestMessageRoleEnum;
    message: string;
}

class Conversation {
    static MESSAGE_LIFETIME = 600; // Seconds
    static MESSAGE_HISTORY_SIZE = 15;
    static IDENTITY: OpenAi.ChatCompletionRequestMessage = { role: "system", content: "You are a sentient human being with personal preferences and emotions." };
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
        let messages: OpenAi.ChatCompletionRequestMessage[] = [Conversation.IDENTITY];
        for (let m of this.messages) messages.push({ role: m.role, content: m.message });
        return messages;
    }
}

export async function Run(channel, tags, msg, self, client: Twitch.Client, args: string[], argswithcase: string[]): Promise<boolean> {
    argswithcase.shift();
    let response;

    try {
        // Handle conversations
        if (!conversations.has(channel)) conversations.set(channel, new Conversation());
        conversations.get(channel).AddMessage({ role: "user", message: argswithcase.join(" ") });
        settings.text.messages = conversations.get(channel).GetMessages();

        // Handle response
        response = await OPENAI_API.createChatCompletion(settings.text);
        if (response.data.choices[0].message != "") client.say(channel, response.data.choices[0].message.content); else client.say(channel, "No clue mate");

        // Update context
        conversations.get(channel).AddMessage({ role: response.data.choices[0].message.role, message: response.data.choices[0].message.content });
        console.log(conversations.get(channel).GetMessages());

        // Logging
        console.log(`${Utils.GetTimeStamp()} [OpenAI] Begining of Response`);
        console.log(`${Utils.GetTimeStamp()} [OpenAI] Response: ${response.data.choices[0].message.content.replace("\n", "\\n")}`);
        console.log(`${Utils.GetTimeStamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
        console.log(`${Utils.GetTimeStamp()} [OpenAI] End of Response`);
    } catch (e) {
        console.log(`${Utils.GetTimeStamp()} [OpenAI] Begining of Response`);
        console.log(`${Utils.GetTimeStamp()} [OpenAI] Response: ${e}`);
        console.log(`${Utils.GetTimeStamp()} [OpenAI] End of Response`);
    }

    return true;
}

export const NSFW: boolean = false;
export const name: string = "OpenAI-GPT4";
export const category: string = global.COMMAND_CATEGORIES.FUN.NAME;
export const aliases: string[][] = [
    ["fa3"]
]