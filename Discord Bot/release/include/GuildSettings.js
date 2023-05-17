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
exports.SetNsfw = exports.GetPrefix = exports.SetPrefix = exports.GetData = exports.Reload = void 0;
const FileSystem = __importStar(require("fs"));
const BotSettings = __importStar(require("../include/BotSettings.js"));
const DEFAULT_SETTINGS = {
    prefix: ".",
    nsfw: true
};
const FILEPATH = "./data/GuildSettings.json";
let data = new Map(JSON.parse(FileSystem.readFileSync(FILEPATH, "utf-8")));
function Reload() {
    data = JSON.parse(FileSystem.readFileSync(FILEPATH, "utf-8"));
}
exports.Reload = Reload;
function Save() {
    FileSystem.writeFileSync(FILEPATH, JSON.stringify(data, null, 2));
}
function Validate() {
    let removelist = [];
    for (let [id, settings] of data)
        if (settings == DEFAULT_SETTINGS)
            removelist.push(id);
    for (let id of removelist)
        data.delete(id);
}
function GetData() {
    return data;
}
exports.GetData = GetData;
function SetPrefix(id, prefix) {
    if (!data.has(id))
        data.set(id, { prefix: prefix, nsfw: DEFAULT_SETTINGS.nsfw });
    else
        data.get(id).prefix = prefix;
    Validate();
    Save();
}
exports.SetPrefix = SetPrefix;
function GetPrefix(id) {
    return data.get(id).prefix || BotSettings.PREFIX;
}
exports.GetPrefix = GetPrefix;
function SetNsfw(id, nsfw) {
    if (!data.has(id))
        data.set(id, { prefix: DEFAULT_SETTINGS.prefix, nsfw: nsfw });
    else
        data.get(id).nsfw = nsfw;
    Validate();
    Save();
}
exports.SetNsfw = SetNsfw;
