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
const Sharp = __importStar(require("sharp"));
const FileSystem = __importStar(require("fs"));
const CommandHandler = __importStar(require("../../../CommandHandler.js"));
const WebClient = __importStar(require("../../../../helpers/WebClient.js"));
const Settings = __importStar(require("../../../../helpers/BotSettings.js"));
const Utility = __importStar(require("../../../../helpers/Utility.js"));
const TEMP_PATH = Settings.TEMP_PATH.concat("/santahat/");
const ASSETS_PATH = Settings.ASSETS_PATH.concat("/santahat/");
exports.command = {
    name: "Santa Hat",
    category: "Fun",
    nsfw: false,
    aliases: [
        ["santahat"],
        ["sh"]
    ],
    devMode: false,
    Run: async function (message, args, argsWithCase, client) {
        let member = null;
        if (message.mentions.members.size > 0)
            member = message.mentions.members.first();
        else
            member = message.member;
        let url = member.displayAvatarURL();
        let extension = member.displayAvatarURL().split(".").pop();
        let profilePicturePath = TEMP_PATH.concat(member.id, ".", extension);
        try {
            await WebClient.DownloadFile(member.displayAvatarURL(), profilePicturePath);
        }
        catch (e) {
            CommandHandler.LogError(`${Utility.GenerateTimestamp()} ${e}`);
            return CommandHandler.ExitCode.InternalError;
        }
        let canvas = Sharp.default({
            create: {
                background: { r: 0, g: 0, b: 0, alpha: 0 },
                channels: 4,
                height: 210,
                width: 180
            }
        });
        let composition = [
            {
                input: profilePicturePath,
                top: 69,
                left: 7
            },
            {
                input: await Sharp.default(ASSETS_PATH.concat("SantaHat.png")).toBuffer(),
                top: 5,
                left: 4
            }
        ];
        canvas.composite(composition);
        canvas.png();
        await canvas.toFile(TEMP_PATH.concat("santahat.png"));
        await message.channel.send({
            files: [
                new Discord.AttachmentBuilder(TEMP_PATH.concat("santahat.png"))
            ]
        });
        FileSystem.unlinkSync(TEMP_PATH.concat("santahat.png"));
        FileSystem.unlinkSync(profilePicturePath);
        return CommandHandler.ExitCode.Success;
    }
};
