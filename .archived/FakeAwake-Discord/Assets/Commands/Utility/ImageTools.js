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
var FileSystem = __importStar(require("fs"));
var Sharp = __importStar(require("sharp"));
var WebClient = __importStar(require("../../include/WebClient.js"));
function Run(message, args, argswithcase, client) {
    return __awaiter(this, void 0, void 0, function () {
        var url, extention, image, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (message.attachments.size < 1) {
                        // send usage embed
                        return [2 /*return*/, true];
                    }
                    url = message.attachments.first().url;
                    extention = url.split(".")[url.split(".").length - 1];
                    return [4 /*yield*/, WebClient.DownloadFileAsync(url, "./Assets/temp/original.".concat(extention))];
                case 1:
                    _a.sent();
                    image = Sharp.default("./Assets/temp/original.".concat(extention));
                    for (i = 0; i < args.length; i++) {
                        switch (args[i]) {
                            // Resizing
                            case "-width":
                                if (parseInt(args[i + 1], 10))
                                    image.resize({ width: parseInt(args[i + 1], 10), fit: Sharp.fit.fill });
                                break;
                            case "-height":
                                if (parseInt(args[i + 1], 10))
                                    image.resize({ height: parseInt(args[i + 1], 10), fit: Sharp.fit.fill });
                                break;
                            // Image Operations
                            case "-rotate":
                                if (parseInt(args[i + 1], 10))
                                    image.rotate(parseInt(args[i + 1], 10));
                                break;
                            case "-flip":
                                image.flip();
                                break;
                            case "-flop":
                                image.flop();
                                break;
                            case "-sharpen":
                                if (parseFloat(args[i + 1]))
                                    image.sharpen(parseFloat(args[i + 1]));
                                break;
                            case "-blur":
                                if (parseFloat(args[i + 1]))
                                    image.blur(parseFloat(args[i + 1]));
                                break;
                            case "-gamma":
                                if (parseFloat(args[i + 1]))
                                    image.gamma(parseFloat(args[i + 1]));
                                break;
                            case "-negate":
                                if (parseInt(args[i + 1], 10))
                                    image.negate();
                                break;
                            case "-threshold":
                                if (parseInt(args[i + 1], 10))
                                    image.threshold(parseInt(args[i + 1], 10));
                                break;
                            case "-hueshift":
                                if (parseFloat(args[i + 1]))
                                    image.modulate({ hue: parseFloat(args[i + 1]) });
                                break;
                            case "-saturation":
                                if (parseFloat(args[i + 1]))
                                    image.modulate({ saturation: parseFloat(args[i + 1]) });
                                break;
                            case "-lightness":
                                if (parseFloat(args[i + 1]))
                                    image.modulate({ lightness: parseFloat(args[i + 1]) });
                                break;
                            case "-brightness":
                                if (parseFloat(args[i + 1]))
                                    image.modulate({ brightness: parseFloat(args[i + 1]) });
                                break;
                            case "-greyscale":
                                image.greyscale();
                                break;
                        }
                    }
                    // Save and send image
                    return [4 /*yield*/, image.toFile("./Assets/temp/edited.png")];
                case 2:
                    // Save and send image
                    _a.sent();
                    return [4 /*yield*/, message.channel.send({ attachments: [new Discord.MessageAttachment("./Assets/temp/edited.png")] })];
                case 3:
                    _a.sent();
                    // Clean up files
                    FileSystem.unlinkSync("./Assets/temp/original.".concat(extention));
                    FileSystem.unlinkSync("./Assets/temp/edited.png");
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.Run = Run;
exports.NSFW = false;
exports.title = "ImageTools";
exports.category = global.COMMAND_CATEGORIES.UTILITY.NAME;
exports.aliases = [
    ["editx"]
];
//# sourceMappingURL=ImageTools.js.map