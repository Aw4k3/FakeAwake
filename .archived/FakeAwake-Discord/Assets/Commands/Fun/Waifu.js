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
var NekosLife = __importStar(require("nekos.life"));
var Utils = __importStar(require("../../include/Utils.js"));
var instances = new Map();
var NEKO_CLIENT = new NekosLife.default;
var REROLL_BUTTON = new Discord.MessageButton()
    .setCustomId("reroll")
    .setLabel("Reroll")
    .setStyle("SUCCESS");
var WAIFU_MENU = new Discord.MessageSelectMenu()
    .setCustomId("endpoint")
    .setPlaceholder("Waifu Type")
    .addOptions([
    {
        label: "Avatar",
        value: "avatar",
        emoji: "772950364437610518"
    },
    {
        label: "Cuddle",
        value: "cuddle",
        emoji: "883376930282414100"
    },
    {
        label: "Feed",
        value: "feed",
        emoji: "852926235919122452"
    },
    {
        label: "Foxgirl",
        value: "fox_girl",
        emoji: "800166987099144192"
    },
    {
        label: "Gasm",
        value: "gasm",
        emoji: "857029075260407819"
    },
    {
        label: "Genetically Engineered Catgirl",
        value: "gecg",
        emoji: "951057797037064213"
    },
    {
        label: "Goose",
        value: "goose",
        emoji: "918653131565432852"
    },
    {
        label: "Hug",
        value: "hug",
        emoji: "1008812073368694915"
    },
    {
        label: "Kiss",
        value: "kiss",
        emoji: "788152154585301022"
    },
    {
        label: "Lewd",
        value: "lewd",
        emoji: "801906570829103144"
    },
    {
        label: "Lizard",
        value: "lizard",
        emoji: "852923680718848060"
    },
    {
        label: "Meow",
        value: "meow",
        emoji: "885283542576295957"
    },
    {
        label: "Neko",
        value: "neko",
        emoji: "902939601814052904"
    },
    {
        label: "Neko Gif",
        value: "ngif",
        emoji: "902939601814052904"
    },
    {
        label: "Pat",
        value: "pat",
        emoji: "822152587033837579"
    },
    {
        label: "Slap",
        value: "slap",
        emoji: "638480830204870710"
    },
    {
        label: "Smug",
        value: "smug",
        emoji: "701255431854489630"
    },
    {
        label: "Spank",
        value: "spank",
        description: "? Possible NSFW results",
        emoji: "648393455264989196"
    },
    {
        label: "Tickle",
        value: "tickle",
        emoji: "852924118239936522"
    },
    {
        label: "Wallpaper",
        value: "wallpaper",
        description: "? Possible NSFW results",
        emoji: "586303697739448320"
    },
    {
        label: "Woof",
        value: "woof",
        emoji: "808379650341339175"
    }
]);
var ACTION_ROW_MENU = new Discord.MessageActionRow()
    .addComponents(WAIFU_MENU);
var ACTION_ROW_BUTTONS = new Discord.MessageActionRow()
    .addComponents(REROLL_BUTTON);
var Instance = /** @class */ (function () {
    function Instance(channel) {
        this.endpoint = "avatar";
        this.message = null;
        this.embed = new Discord.MessageEmbed();
        this.interactioncollector = null;
        this.Instance(channel);
    }
    Instance.prototype.Instance = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("https://nekos.life/api/v2/img/".concat(this.endpoint))];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _b.sent();
                        this.embed.setTitle("Waifus")
                            .setImage(data.url)
                            .setFooter({ text: Utils.CapitilizeFirstLetter(this.endpoint) });
                        _a = this;
                        return [4 /*yield*/, channel.send({ embeds: [this.embed], components: [ACTION_ROW_MENU, ACTION_ROW_BUTTONS] })];
                    case 3:
                        _a.message = _b.sent();
                        this.interactioncollector = this.message.createMessageComponentCollector();
                        this.interactioncollector.on("collect", this.InteractionHandler.bind(this));
                        return [2 /*return*/];
                }
            });
        });
    };
    Instance.prototype.Deinitialise = function () {
        this.message.edit({ embeds: [this.embed], components: [] });
    };
    Instance.prototype.InteractionHandler = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (interaction.customId == "endpoint")
                            this.endpoint = interaction.values[0];
                        return [4 /*yield*/, fetch("https://nekos.life/api/v2/img/".concat(this.endpoint))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        console.log(data);
                        this.embed.setImage(data.url)
                            .setFooter({ text: Utils.CapitilizeFirstLetter(this.endpoint) });
                        this.message.edit({ embeds: [this.embed], components: [ACTION_ROW_MENU, ACTION_ROW_BUTTONS] });
                        interaction.deferUpdate();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Instance;
}());
function Run(message, args, argswithcase, client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (instances.has(message.channel.id))
                instances.get(message.channel.id).Deinitialise();
            instances.set(message.channel.id, new Instance(message.channel));
            return [2 /*return*/, true];
        });
    });
}
exports.Run = Run;
exports.NSFW = false;
exports.title = "Waifu";
exports.category = global.COMMAND_CATEGORIES.UTILITY.NAME;
exports.aliases = [
    ["waifu"]
];
//# sourceMappingURL=Waifu.js.map