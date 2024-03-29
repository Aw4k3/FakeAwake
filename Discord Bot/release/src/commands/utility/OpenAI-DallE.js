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
const WebClient = __importStar(require("../../../helpers/WebClient.js"));
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
        ["fakeawakei"],
        ["fai"],
        ["fakeawakeie"],
        ["faie"]
    ],
    devMode: false,
    Run: async function (message, args, argswithcase, client) {
        argswithcase.shift();
        settings.prompt = argswithcase.join(" ");
        var m = await message.channel.send("<a:Loading:965027668280111255> generating...");
        switch (args[0].charAt(args[0].length - 1)) {
            case 'e':
                if (message.attachments.size < 1) {
                    message.channel.send("Image attachment with transparency required (.png)");
                    return CommandHandler.ExitCode.UsageError;
                }
                if (!message.attachments.first().url.endsWith(".png")) {
                    message.channel.send("Image attachment with transparency required (.png)");
                    return CommandHandler.ExitCode.UsageError;
                }
                try {
                    await WebClient.DownloadFile(message.attachments.first().url, "./temp/openai_input.png");
                    let response = await OPENAI_API.createImageEdit(FileSystem.createReadStream("./temp/openai_input.png"), settings.prompt);
                    await WebClient.DownloadFile(response.data.data[0].url, "./temp/openai_result.png");
                    m.edit("<a:Loading:965027668280111255> uploading...");
                    await message.channel.send({ files: [new Discord.AttachmentBuilder("temp/openai_result.png")] });
                    await FileSystem.unlinkSync("./temp/openai_input.png");
                    await FileSystem.unlinkSync("./temp/openai_result.png");
                    m.delete();
                }
                catch (e) {
                    m.edit(`Internal Error`);
                    CommandHandler.Log(`${e}`);
                    return CommandHandler.ExitCode.InternalError;
                }
                break;
            case "i":
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
                    CommandHandler.Log(`${e}`);
                    return CommandHandler.ExitCode.InternalError;
                }
        }
        return CommandHandler.ExitCode.Success;
    }
};
