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
const MessageChains = __importStar(require("./system/MessageChains.js"));
const MySql = __importStar(require("mysql"));
const CommandHandler = __importStar(require("./CommandHandler.js"));
const BotSettings = __importStar(require("../helpers/BotSettings.js"));
const START_TIME = Date.now();
const MYSQL = MySql.createConnection({
    host: "192.168.1.10",
    user: "bot",
    password: process.env.FAKEAWAKE_SQL_PASSWORD
});
const CLIENT = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});
const PREFIX = BotSettings.PREFIX;
CommandHandler.LoadCommands(CLIENT);
CLIENT.once(Discord.Events.ClientReady, OnReady);
CLIENT.on(Discord.Events.MessageCreate, OnMessageCreate);
function OnReady() {
    CommandHandler.Log(`Loaded in ${(Date.now() - START_TIME) / 1000} seconds`);
    CommandHandler.Log(`Logged in as ${CLIENT.user.tag}`);
}
function OnMessageCreate(message) {
    if (message.author.bot)
        return;
    MessageChains.UpdateChain(message.channel, message.content);
    if (!message.content.startsWith(PREFIX))
        return;
    let args = message.content.substr(PREFIX.length).toLowerCase().split(/\s+/);
    let argswithcase = message.content.substr(PREFIX.length).split(/\s+/);
    CommandHandler.Resolve(message, args, argswithcase, CLIENT);
}
CLIENT.login(process.env.DISCORD_BOT_TOKEN);
