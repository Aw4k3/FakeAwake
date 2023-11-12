import * as FileSystem from "fs";
import * as Discord from "discord.js";
import * as Utility from "../include/Utility.js";
import * as Api from "../include/Api.js";
import * as CommandHandler from "./CommandHandler.js";
import * as BotSettings from "../include/BotSettings.js";

const START_TIME = Date.now();
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
Api.Start();
CommandHandler.LoadCommands();

CLIENT.once(Discord.Events.ClientReady, OnReady);
CLIENT.on(Discord.Events.MessageCreate, OnMessageCreate);


function OnReady(): void {
    console.log(`${Utility.GenerateTimestamp()} Loaded in ${(Date.now() - START_TIME) / 1000} seconds`);
    console.log(`${Utility.GenerateTimestamp()} Logged in as ${CLIENT.user.tag}`);
}

function OnMessageCreate(message: Discord.Message): void {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    let args = message.content.substr(PREFIX.length).toLowerCase().split(/\s+/);
    let argswithcase = message.content.substr(PREFIX.length).split(/\s+/);
    
    CommandHandler.Resolve(message, args, argswithcase, CLIENT);
}

CLIENT.login(process.env.DISCORD_BOT_TOKEN);