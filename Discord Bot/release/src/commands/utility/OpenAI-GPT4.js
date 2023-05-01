"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const OpenAi = __importStar(require("openai"));
const CommandHandler = __importStar(require("../../CommandHandler.js"));
const Utility = __importStar(require("../../../include/Utility.js"));
const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);
let conversations = new Map();
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
};
class Conversation {
    static MESSAGE_LIFETIME = 600;
    static MESSAGE_HISTORY_SIZE = 15;
    static IDENTITY = { role: "system", content: "Your name is FakeAwake. You are a really smart person." };
    messages = [];
    timers = [];
    AddMessage(message) {
        this.messages.push(message);
        this.timers.push(setTimeout(() => this.messages.splice(0, 1), Conversation.MESSAGE_LIFETIME * 1000));
        if (this.messages.length > Conversation.MESSAGE_HISTORY_SIZE) {
            this.messages.splice(0, 1);
            clearTimeout(this.timers[0]);
        }
    }
    GetMessages() {
        let messages = [Conversation.IDENTITY];
        for (let m of this.messages)
            messages.push({ role: m.role, content: m.message });
        return messages;
    }
}
exports.command = {
    name: "OpenAI-GPT4",
    category: "Utility",
    nsfw: false,
    aliases: [
        ["fakeawake3"],
        ["fa3"],
        ["summonfakeawake3"],
        ["sfa3"]
    ],
    Run: async function (message, args, argswithcase, client) {
        argswithcase.shift();
        let response;
        var m = await message.channel.send("<a:Loading:965027668280111255> thinking... (fa3 is unstable, consider using fa2 if this isn't working out)");
        try {
            let channel_id = message.channel.id;
            if (!conversations.has(channel_id))
                conversations.set(channel_id, new Conversation());
            conversations.get(channel_id).AddMessage({ role: "user", message: argswithcase.join(" ") });
            settings.text.messages = conversations.get(channel_id).GetMessages();
            response = await OPENAI_API.createChatCompletion(settings.text);
            if (response.data.choices[0].message != "")
                m.edit(response.data.choices[0].message.content);
            else
                message.edit("idk");
            conversations.get(channel_id).AddMessage({ role: response.data.choices[0].message.role, message: response.data.choices[0].message.content });
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Begining of Response`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response: ${response.data.choices[0].message.content.replace("\n", "\\n")}`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] End of Response`);
        }
        catch (e) {
            m.edit("I broke, please try again. If I'm still broken then blame <@301985885870882827> >:)");
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Begining of Response`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] Response: ${e}`);
            console.log(`${Utility.GenerateTimestamp()} [OpenAI] End of Response`);
            return CommandHandler.ExitCode.InternalError;
        }
        return CommandHandler.ExitCode.Success;
    }
};
