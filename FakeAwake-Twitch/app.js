// @ts-check

const tmi = require("tmi.js");
const Utils = require("./Assets/include/Utils.js");
const CommandHandler = require("./Assets/include/CommandHandler.js");

const PREFIX = "!";

// Define configuration options
const opts = {
    options: {
        debug: false
    },
    identity: {
        username: "FakeAwake",
        password: "oauth:039ptgbzk3llc77giht896ctimeeli"
    },
    channels: [
        "awake_live",
        "crimsoneevee",
        "danroleth",
        "softspokenserenity",
        "nearlymars",
        "jkchamp1",
        "jcvlegend",
        "taniwhaladdd",
        "hettyj",
        "nt_thebeekeeper"
    ]
};

// Load Commands
CommandHandler.LoadCommands("./Assets/Commands");

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(channel, tags, msg, self) {
    if (self || !msg.startsWith(PREFIX)) return; // Ignore messages and self
    
    // Generate Args
    msg = msg.trim();
    const args = msg.slice(PREFIX.length).toLowerCase().split(" ");
    const args_with_case = msg.slice(PREFIX.length).split(" ");
    
    // Commands
    if (/how.+/.test(args[0])) {
        if (CommandHandler.GetCommands().get("howx").Run(channel, tags, msg, self, client, args, args_with_case)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${CommandHandler.GetCommands().get("howx").name}"`); }
        return;
    }

    CommandHandler.Resolve(channel, tags, msg, self, client, args, args_with_case);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`${Utils.GetTimeStamp()} Connected to ${addr}:${port}`);
}
