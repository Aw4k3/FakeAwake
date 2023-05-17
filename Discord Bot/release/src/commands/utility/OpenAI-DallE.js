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
const Discord = __importStar(require("discord.js"));
const OpenAi = __importStar(require("openai"));
const FileSystem = __importStar(require("fs"));
const CommandHandler = __importStar(require("../../CommandHandler.js"));
const Utility = __importStar(require("../../../include/Utility.js"));
const WebClient = __importStar(require("../../../include/WebClient.js"));
const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);
let settings = {
    prompt: "",
    n: 1,
    size: "1024x1024"
};
exports.command = {
    name: "OpenAI-DallE",
    category: "Utility",
    nsfw: false,
    aliases: [
        ["fakeawake2i"],
        ["fa2i"],
        ["fakeawakei"],
        ["fai"]
    ],
    Run: async function (message, args, argswithcase, client) {
        argswithcase.shift();
        settings.prompt = argswithcase.join(" ");
        var m = await message.channel.send("<a:Loading:965027668280111255> generating...");
        try {
            let response = await OPENAI_API.createImage(settings);
            await WebClient.DownloadFile(response.data.data[0].url, "./temp/openai_result.png");
            m.edit("<a:Loading:965027668280111255> uploading...");
            await message.channel.send({ files: [new Discord.AttachmentBuilder("temp/openai_result.png")] });
            await FileSystem.unlinkSync("./temp/openai_result.png");
            m.delete();
        }
        catch (e) {
            m.edit(`Internal Error`);
            console.log(`${Utility.GenerateTimestamp()} ${e}`);
            return CommandHandler.ExitCode.InternalError;
        }
        return CommandHandler.ExitCode.Success;
    }
};
