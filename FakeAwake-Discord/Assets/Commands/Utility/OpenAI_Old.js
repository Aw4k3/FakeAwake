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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliases = exports.category = exports.title = exports.NSFW = exports.Run = void 0;
var Discord = __importStar(require("discord.js"));
var DiscordVoice = __importStar(require("@discordjs/voice"));
var OpenAi = __importStar(require("openai"));
var FileSystem = __importStar(require("fs"));
var GoogleTts = __importStar(require("google-tts-api"));
var WebClient = __importStar(require("../../include/WebClient"));
var Utils = __importStar(require("../../include/Utils.js"));
var OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
var OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);
var settings = {
    text: {
        model: "text-davinci-003",
        prompt: "",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    },
    image: {
        prompt: "",
        n: 1,
        size: "1024x1024"
    }
};
var VoiceAssisstant = /** @class */ (function () {
    function VoiceAssisstant(vc) {
        this.guildid = "";
        this.audioplayer = new DiscordVoice.AudioPlayer();
        this.queue = [];
        this.isplaying = false;
        this.guildid = vc.guild.id;
        this.connection = DiscordVoice.joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator
        });
        this.connection.subscribe(this.audioplayer);
        // Event Handlers
        this.connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, this.DisconnectHandler.bind(this));
        this.audioplayer.on(DiscordVoice.AudioPlayerStatus.Idle, this.PlayerIdlingHandler.bind(this));
        this.audioplayer.on("error", this.PlayerErrorHandler.bind(this));
    }
    VoiceAssisstant.prototype.GenerateResponse = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var Urls, _i, Urls_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (prompt == null)
                            return [2 /*return*/];
                        return [4 /*yield*/, GoogleTts.getAllAudioUrls(prompt, { lang: "en-GB" })];
                    case 1:
                        Urls = _a.sent();
                        for (_i = 0, Urls_1 = Urls; _i < Urls_1.length; _i++) {
                            item = Urls_1[_i];
                            this.queue.push(item.url);
                        }
                        if (!this.isplaying)
                            this.Play();
                        return [2 /*return*/];
                }
            });
        });
    };
    VoiceAssisstant.prototype.Play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var audioresource;
            return __generator(this, function (_a) {
                // Stream Audio
                this.isplaying = true;
                audioresource = DiscordVoice.createAudioResource(this.queue[0], { inputType: DiscordVoice.StreamType.Opus });
                this.audioplayer.play(audioresource);
                return [2 /*return*/];
            });
        });
    };
    // Event Handlers
    VoiceAssisstant.prototype.PlayerIdlingHandler = function () {
        this.queue.shift();
        if (this.queue.length < 1) {
            this.isplaying = false;
            this.connection.destroy();
        }
        else {
            this.Play();
        }
    };
    VoiceAssisstant.prototype.DisconnectHandler = function () {
        try {
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Signalling, 5000);
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Connecting, 5000);
        }
        catch (e) {
            console.log("".concat(Utils.GetTimeStamp(), " ").concat(e));
        }
    };
    VoiceAssisstant.prototype.PlayerErrorHandler = function (error) {
        console.log("".concat(Utils.GetTimeStamp(), " Error: ").concat(error.message, " with resource ").concat(error.resource.metadata.title));
    };
    VoiceAssisstant.Instances = new Map();
    return VoiceAssisstant;
}());
function Run(message, args, argswithcase, client) {
    return __awaiter(this, void 0, void 0, function () {
        var operation, _a, m, response_1, e_1, response, m, e_2, vc, g_id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    operation = args[0].charAt(args[0].length - 1);
                    argswithcase.shift();
                    _a = operation;
                    switch (_a) {
                        case "i": return [3 /*break*/, 1];
                        case "2": return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 17];
                case 1:
                    settings.image.prompt = argswithcase.join(" ");
                    return [4 /*yield*/, message.channel.send("<a:Loading:965027668280111255> generating...")];
                case 2:
                    m = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, OPENAI_API.createImage(settings.image)];
                case 4:
                    response_1 = _b.sent();
                    WebClient.DownloadFileAsync(response_1.data.data[0].url, "./Assets/temp/openai_result.png");
                    m.edit("<a:Loading:965027668280111255> uploading...");
                    return [4 /*yield*/, message.channel.send({ files: [new Discord.MessageAttachment("Assets/temp/openai_result.png")] })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, FileSystem.unlinkSync("./Assets/temp/openai_result.png")];
                case 6:
                    _b.sent();
                    m.delete();
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _b.sent();
                    m.edit("Status: ".concat(e_1.message));
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 17];
                case 9:
                    response = void 0;
                    settings.text.prompt = argswithcase.join(" ");
                    return [4 /*yield*/, message.channel.send("<a:Loading:965027668280111255> thinking...")];
                case 10:
                    m = _b.sent();
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, OPENAI_API.createCompletion(settings.text)];
                case 12:
                    response = _b.sent();
                    if (response.data.choices[0].text != "")
                        m.edit(response.data.choices[0].text);
                    else
                        message.edit("idk");
                    return [3 /*break*/, 14];
                case 13:
                    e_2 = _b.sent();
                    m.edit("Status: ".concat(e_2.response.status, ", ").concat(e_2.response.statusText));
                    return [3 /*break*/, 14];
                case 14:
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Begining of Response"));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Response: ").concat(response.data.choices[0].text.replace("\n", "\\n")));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Response Finish Reason: ").concat(response.data.choices[0].finish_reason));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] End of Response"));
                    if (!args[0].startsWith("s")) return [3 /*break*/, 16];
                    return [4 /*yield*/, message.member.voice.channel];
                case 15:
                    vc = _b.sent();
                    if (vc == null) {
                        message.channel.send("".concat(message.member.user, ", join vc if you want me to chat to you babes."));
                        return [3 /*break*/, 17];
                    }
                    if (!vc.joinable) {
                        message.channel.send("".concat(message.member.user, ", I can't join your vc."));
                        return [3 /*break*/, 17];
                    }
                    g_id = message.guild.id;
                    if (!VoiceAssisstant.Instances.has(g_id))
                        VoiceAssisstant.Instances.set(g_id, new VoiceAssisstant(vc));
                    VoiceAssisstant.Instances.get(g_id).GenerateResponse(response.data.choices[0].text);
                    m.edit("(Speaking) ".concat(response.data.choices[0].text.trim()));
                    _b.label = 16;
                case 16: return [3 /*break*/, 17];
                case 17: return [2 /*return*/, true];
            }
        });
    });
}
exports.Run = Run;
exports.NSFW = false;
exports.title = "OpenAI-TD3";
exports.category = global.COMMAND_CATEGORIES.UTILITY.NAME;
exports.aliases = [
    // Text Response
    ["fakeawake2"],
    ["fa2"],
    // Text + Voice Response
    ["summonfakeawake2"],
    ["sfa2"],
    // Image Response
    ["fakeawake2i"],
    ["fa2i"]
];
//# sourceMappingURL=OpenAI_Old.js.map