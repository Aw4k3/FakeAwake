// @ts-check
const Discord = require("discord.js");
const FileSystem = require("fs");
const Sharp = require("sharp");
const readline = require("readline");
const Utils = require("./Assets/include/Utils.js");
const GuildSettings = require("./Assets/include/GuildSettings.js");
const Http = require("http");
const CommandHandler = require("./Assets/include/CommandHandler.js");
const MessageChainHandler = require("./Assets/include/MessageChainHandler.js");

const DateTime = new Date();
const START_TIME = DateTime.getTime();
const SECRETS = JSON.parse(FileSystem.readFileSync("./secrets/FakeAwake Secrets.json", "utf8"));
const TOKEN = SECRETS.Discord.Token;
const ReadLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function request_listener(req, res) {
    switch (req.url) {
        case "/discord/server_count":
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ ServerCount: Array.from(CLIENT.guilds.cache.values()).length }));
            res.end();
            break;

        default:
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("hi");
            break;
    }
}

const SERVER = Http.createServer(request_listener);
SERVER.listen("420", "localhost", () => {
    console.log(`${Utils.GetTimeStamp()} Server running on localhost:420`);
});

/**************************** Init Bot ****************************/
const CLIENT = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const PREFIX = ".";

var pause_execution = false;

CommandHandler.LoadCommands("./Assets/Commands");

function ResolvePrefix(message) {
    const GUILD_CONFIGS = JSON.parse(FileSystem.readFileSync("./Assets/Data/GuildConfigs.json", "utf-8"));

    if (Object.keys(GUILD_CONFIGS).includes(message.guild.id)) {
        if (Object.keys(GUILD_CONFIGS[message.guild.id]).includes(GuildSettings.PROPERTIES.PREFIX)) {
            return {
                valid_prefix: message.content.startsWith(GUILD_CONFIGS[message.guild.id][GuildSettings.PROPERTIES.PREFIX]),
                prefix: GUILD_CONFIGS[message.guild.id][GuildSettings.PROPERTIES.PREFIX]
            }
        } else {
            return {
                valid_prefix: message.content.startsWith(PREFIX),
                prefix: PREFIX
            }
        }
    } else {
        return {
            valid_prefix: message.content.startsWith(PREFIX),
            prefix: PREFIX
        }
    }
}

function ResolveBotChannels(message) {
    const GUILD_CONFIGS = JSON.parse(FileSystem.readFileSync("./Assets/Data/GuildConfigs.json", "utf-8"));

    if (Object.keys(GUILD_CONFIGS).includes(message.guild.id)) {
        if (Object.keys(GUILD_CONFIGS[message.guild.id]).includes(GuildSettings.PROPERTIES.BOT_CHANNELS)) {
            if (GUILD_CONFIGS[message.guild.id][GuildSettings.PROPERTIES.BOT_CHANNELS].includes(message.channel.id)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return true;
    }
}

/**************************** End of Setup Commands ****************************/
Sharp.cache(false);

/**************************** Client Handler ****************************/

CLIENT.on("ready", DiscordBotReadyHandler);
CLIENT.on("messageCreate", DiscordBotOnMessageCreateHandler)

function DiscordBotReadyHandler() {
    CLIENT.user.setPresence(JSON.parse(FileSystem.readFileSync("./Assets/Data/FakeAwakeStatus.json", "utf-8")));

    console.log(`${Utils.GetTimeStamp()} Loaded in ${(new Date().getTime() - START_TIME) / 1000} seconds!`);
    console.log(`${Utils.GetTimeStamp()} Logged in as ${CLIENT.user.tag}!`);

    if (CommandHandler.GetCommands().get("set_avatar").Run(null, null, null, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("profilepic").name}"`); }

    if (CommandHandler.GetCommands().get("exercise").Run(null, null, null, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("exercise").name}"`); }

    if (CommandHandler.GetCommands().get("duoreminder").Run(null, null, null, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("duoreminder").name}"`); }
}

function DiscordBotOnMessageCreateHandler(message) {
    if (pause_execution) return;

    var resolved_prefix = ResolvePrefix(message);
    
    // Regular Message Events
    if (message.channel.id === "907994759413518378")
        if (CommandHandler.GetCommands().get("photoChallenge").submit(message, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("photoChallenge").name}"`); }
    
    if (message.channel.id === "876035515512655872")
        if (CommandHandler.GetCommands().get("autoPauseFish").Run(message, args, args_with_case, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("autoPauseFish").name}"`); }
    
    // Add one balance to user per message
    // Only ticks if they have an open account
     // FILE GOT CORRUPTED 20/09/2022 // if (message.content[0] !== resolved_prefix.prefix) { Banking.TickBalance(message.author); }

    MessageChainHandler.Resolve(message);
    
    /******************* Break message into args *******************/
    if (!resolved_prefix.valid_prefix || message.author.bot) return                           // If the message doesn't have the prefix or is from a bot, dont to anything.
    var args = message.content.slice(resolved_prefix.prefix.length).toLowerCase().split(" "); // Get the message, cut off the prefix, change to all lower case, split on space.
    var args_with_case = message.content.slice(resolved_prefix.prefix.length).split(" ");     //

    /******************* Log input *******************/
    console.log(`${Utils.GetTimeStamp()} ${message.author.tag} executed ${message.content}`);

    /******************* Execution *******************/
    if (!ResolveBotChannels(message)) return
    
    if (/b+a+k+a+/.test(args[0])) {
        if (CommandHandler.GetCommands().get("baka").Run(message, args, args_with_case, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("baka").name}"`); }
        return;
    }

    if (/how.+/.test(args[0])) {
        if (CommandHandler.GetCommands().get("howX").Run(message, args, args_with_case, CLIENT)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("howX").name}"`); }
        return;
    }
    
    CommandHandler.Resolve(message, args, args_with_case, CLIENT);
};

CLIENT.login(TOKEN);


/**************************** Process Handler ****************************/
//Uncaught Exception Reporter
process.on("uncaughtException", ProcessUncaughtExceptionHandler);

function ProcessUncaughtExceptionHandler(err, origin) {
    console.log(`${Utils.GetTimeStamp()} [Uncaught Exception] Caught exception: ${err}`);
    console.log(`${Utils.GetTimeStamp()} [Uncaught Exception] Exception origin: ${origin}`);
}

/**************************** Console Handler ****************************/
ReadLine.on("line", async command => {
    var args = command.split(" ");

    switch (args[0]) {
        case "del":
        case "delete":
            // Guild => Channel => Message => Emote
            CLIENT.channels.cache.get(args[1]).messages.fetch(args[2]).then(message => message.delete());
            break;

        case "say":
        case "send":
            {
                let message = "";
                for (let i = 2; i < args.length; i++) {
                    message += args[i] + " ";
                }
                CLIENT.channels.cache.get(args[1]).send(message);
            }
            break;

        case "sayt":
        case "sendt":
            {
                let message = "";
                for (let i = 2; i < args.length; i++) {
                    message += args[i] + " ";
                }
                CLIENT.channels.threads.cache.get(args[1]).send(message);
            }
            break;

        case "pause":
            pause_execution = true;
            break

        case "unpause":
        case "play":
            pause_execution = false;
            break

        case "pf":
        case "pausefish":
            CLIENT.channels.cache.get("876035515512655872").send("<:PauseFish:826541956108648545>");
            break

        case "rl":
        case "reload":
            CommandHandler.LoadCommands();
            break;

        case "react":
            // Channel => Message => Emote
            CLIENT.channels.cache.get(args[1]).messages.fetch(args[2]).then(message => message.react(args[3]));
            break;

        case "status":
            try {
                var user = CLIENT.guilds.cache.get(args[1]).members.cache.get(args[2]);
                console.log(`Discord Status | ${user.user.tag} ${user.presence.status}`);
                console.log(`Client Status  | ${user.user.tag} ${JSON.stringify(user.presence.clientStatus)}`);
            } catch (e) {
                console.log(e);
            }
            break;

        case "servers":
            for (var g of Array.from(CLIENT.guilds.cache.values())) {
                var temp = await g.fetchOwner();
                console.log(`${g.name} ${temp.user.tag}`);
            }
            break;
    }
});