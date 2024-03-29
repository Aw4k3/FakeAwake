import * as Discord from "discord.js";
import * as MessageChains from "./system/MessageChains.js";
import * as Utility from "../helpers/Utility.js";
import * as MySql from "mysql";
import * as Api from "../helpers/Api.js";
import * as CommandHandler from "./CommandHandler.js";
import * as BotSettings from "../helpers/BotSettings.js";

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
Api.Start();
CommandHandler.LoadCommands(CLIENT);

CLIENT.once(Discord.Events.ClientReady, OnReady);
CLIENT.on(Discord.Events.MessageCreate, OnMessageCreate);


function OnReady(): void {
    CommandHandler.Log(`Loaded in ${(Date.now() - START_TIME) / 1000} seconds`);
    CommandHandler.Log(`Logged in as ${CLIENT.user.tag}`);
}

function OnMessageCreate(message: Discord.Message): void {
    if (message.author.bot) return; // Ignore messages sent by bots

    MessageChains.UpdateChain(message.channel, message.content);

    if (!message.content.startsWith(PREFIX)) return;

    let args = message.content.substr(PREFIX.length).toLowerCase().split(/\s+/);
    let argswithcase = message.content.substr(PREFIX.length).split(/\s+/);
    
    CommandHandler.Resolve(message, args, argswithcase, CLIENT);
}

CLIENT.login(process.env.DISCORD_BOT_TOKEN);