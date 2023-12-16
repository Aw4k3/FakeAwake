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
};
exports.command = {
    name: "OpenAI-TD3",
    category: "Utility",
    nsfw: false,
    aliases: [
        ["fakeawake2"],
        ["fa2"],
        ["summonfakeawake2"],
        ["sfa2"]
    ],
    devMode: false,
    Run: async function (message, args, argswithcase, client) {
        argswithcase.shift();
        let response;
        settings.prompt = argswithcase.join(" ");
        var m = await message.channel.send("<a:Loading:965027668280111255> thinking...");
        try {
            response = await OPENAI_API.createCompletion(settings);
            if (response.data.choices[0].text != "")
                m.edit(response.data.choices[0].text);
            else
                message.edit("idk");
        }
        catch (e) {
            m.edit(`Status: ${e.response.status}, ${e.response.statusText}`);
            return CommandHandler.ExitCode.InternalError;
        }
        CommandHandler.Log(`[OpenAI] Begining of Response`);
        CommandHandler.Log(`[OpenAI] Response: ${response.data.choices[0].text.replace("\n", "\\n")}`);
        CommandHandler.Log(`[OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
        CommandHandler.Log(`[OpenAI] End of Response`);
        return CommandHandler.ExitCode.Success;
    }
};
