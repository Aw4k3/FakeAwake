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
exports.aliases = exports.category = exports.name = exports.NSFW = exports.Run = void 0;
var OpenAi = __importStar(require("openai"));
var Utils = require("../../include/Utils.js");
var OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
var OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);
var conversations = new Map();
var settings = {
    text: {
        model: "gpt-4",
        messages: [],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    }
};
var Conversation = /** @class */ (function () {
    function Conversation() {
        this.messages = [];
        this.timers = [];
    }
    Conversation.prototype.AddMessage = function (message) {
        var _this = this;
        this.messages.push(message);
        this.timers.push(setTimeout(function () { return _this.messages.splice(0, 1); }, Conversation.MESSAGE_LIFETIME * 1000));
        if (this.messages.length > Conversation.MESSAGE_HISTORY_SIZE) {
            this.messages.splice(0, 1);
            clearTimeout(this.timers[0]);
        }
    };
    Conversation.prototype.GetMessages = function () {
        var messages = [Conversation.IDENTITY];
        for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
            var m = _a[_i];
            messages.push({ role: m.role, content: m.message });
        }
        return messages;
    };
    Conversation.MESSAGE_LIFETIME = 600; // Seconds
    Conversation.MESSAGE_HISTORY_SIZE = 15;
    Conversation.IDENTITY = { role: "system", content: "You are a sentient human being with personal preferences and emotions." };
    return Conversation;
}());
function Run(channel, tags, msg, self, client, args, argswithcase) {
    return __awaiter(this, void 0, void 0, function () {
        var response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    argswithcase.shift();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Handle conversations
                    if (!conversations.has(channel))
                        conversations.set(channel, new Conversation());
                    conversations.get(channel).AddMessage({ role: "user", message: argswithcase.join(" ") });
                    settings.text.messages = conversations.get(channel).GetMessages();
                    return [4 /*yield*/, OPENAI_API.createChatCompletion(settings.text)];
                case 2:
                    // Handle response
                    response = _a.sent();
                    if (response.data.choices[0].message != "")
                        client.say(channel, response.data.choices[0].message.content);
                    else
                        client.say(channel, "No clue mate");
                    // Update context
                    conversations.get(channel).AddMessage({ role: response.data.choices[0].message.role, message: response.data.choices[0].message.content });
                    console.log(conversations.get(channel).GetMessages());
                    // Logging
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Begining of Response"));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Response: ").concat(response.data.choices[0].message.content.replace("\n", "\\n")));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Response Finish Reason: ").concat(response.data.choices[0].finish_reason));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] End of Response"));
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Begining of Response"));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] Response: ").concat(e_1));
                    console.log("".concat(Utils.GetTimeStamp(), " [OpenAI] End of Response"));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, true];
            }
        });
    });
}
exports.Run = Run;
exports.NSFW = false;
exports.name = "OpenAI-GPT4";
exports.category = global.COMMAND_CATEGORIES.FUN.NAME;
exports.aliases = [
    ["fa3"]
];
//# sourceMappingURL=OpenAI-GPT4.js.map