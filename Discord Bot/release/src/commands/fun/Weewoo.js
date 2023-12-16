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
const CommandHandler = __importStar(require("../../CommandHandler.js"));
const Settings = __importStar(require("../../../helpers/BotSettings.js"));
const WebClient = __importStar(require("../../../helpers/WebClient.js"));
const Utility = __importStar(require("../../../helpers/Utility.js"));
const TEMP_PATH = Settings.TEMP_PATH.concat("/weewoo/");
const ASSETS_PATH = Settings.ASSETS_PATH.concat("/weewoo/");
let JailCells = new Map();
Sharp.cache(false);
exports.command = {
    name: "Horny Jail",
    category: "Fun",
    nsfw: false,
    aliases: [["weewoo"]],
    devMode: true,
    Initialise(client) {
        JailCells.set("Default", ASSETS_PATH.concat("DefaultPrison.webp"));
    },
    Run: async function (message, args, argsWithCase, client) {
        if (message.mentions.members.size < 1) {
            message.channel.send("Usage: .weewoo `@mention` � You can chain multiple members");
            return CommandHandler.ExitCode.UsageError;
        }
        let imagePaths = [];
        for (let member of message.mentions.members.values()) {
            let extension = member.displayAvatarURL().split(".").pop();
            try {
                await WebClient.DownloadFile(member.displayAvatarURL(), TEMP_PATH.concat(member.id, ".", extension));
            }
            catch (e) {
                CommandHandler.LogError(`${Utility.GenerateTimestamp()} ${e}`);
                return CommandHandler.ExitCode.InternalError;
            }
            imagePaths.push(TEMP_PATH.concat(member.id, ".", extension));
        }
        let membersCanvas = Sharp.default({
            create: {
                width: 128 * imagePaths.length,
                height: 128,
                channels: 3,
                background: { r: 0, g: 0, b: 0 }
            }
        });
        let offsetX = 0;
        let composition = [];
        for (let imagePath of imagePaths) {
            let temp = await Sharp.default(imagePath)
                .resize({ width: 128, height: 128, fit: Sharp.fit.fill })
                .png()
                .toBuffer();
            composition.push({
                input: temp,
                top: 0,
                left: offsetX,
            });
            offsetX += 128;
        }
        membersCanvas.composite(composition);
        membersCanvas.png();
        let canvas = Sharp.default(JailCells.get("Default"));
        canvas.composite([
            {
                input: await membersCanvas.toBuffer(),
                gravity: Sharp.gravity.centre
            }
        ]);
        canvas.jpeg();
        await canvas.toFile(TEMP_PATH.concat("weewoo.jpg"));
        await message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle("Horny Jail")
                    .setDescription(`${message.author} weewoos ${FormatMentions(Array.from(message.mentions.members.values()))}`)
                    .setImage("attachment://weewoo.jpg")
            ],
            files: [
                new Discord.AttachmentBuilder(TEMP_PATH.concat("weewoo.jpg"))
            ]
        });
        for (var i = 0; i < imagePaths.length; i++)
            FileSystem.unlinkSync(imagePaths[i]);
        return CommandHandler.ExitCode.Success;
    }
};
class JailEntry {
    memberId = "-1";
    member = null;
    jailCount = -1;
    jailedByCounts = new Map();
    constructor(member, jailCount, jailByCounts) {
        this.member = member;
        this.memberId = member.id;
        this.jailCount = jailCount;
        this.jailedByCounts = jailByCounts;
    }
    Increment(jailedBy) {
        this.jailCount++;
        let temp = this.jailedByCounts.get(jailedBy);
        this.jailedByCounts.set(jailedBy, ++temp);
    }
    UpdateDatabase() {
    }
}
function FormatMentions(members) {
    let finalmember = members.pop();
    let result = members.join(", ").concat(" and ", finalmember.toString());
    return result;
}
