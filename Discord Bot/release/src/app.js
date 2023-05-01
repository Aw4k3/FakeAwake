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
const Discord = __importStar(require("discord.js"));
const Utility = __importStar(require("../include/Utility.js"));
const CommandHandler = __importStar(require("./CommandHandler.js"));
const START_TIME = Date.now();
const CLIENT = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});
const PREFIX = "*";
CommandHandler.LoadCommands();
CLIENT.once(Discord.Events.ClientReady, OnReady);
CLIENT.on(Discord.Events.MessageCreate, OnMessageCreate);
function OnReady() {
    console.log(`${Utility.GenerateTimestamp()} Loaded in ${(Date.now() - START_TIME) / 1000} seconds`);
    console.log(`${Utility.GenerateTimestamp()} Logged in as ${CLIENT.user.tag}`);
}
function OnMessageCreate(message) {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(PREFIX))
        return;
    let args = message.content.substr(PREFIX.length).split(/\s+/);
    let argswithcase = message.content.substr(PREFIX.length).toLowerCase().split(/\s+/);
    CommandHandler.Resolve(message, args, argswithcase, CLIENT);
}
CLIENT.login(process.env.DISCORD_BOT_TOKEN);
