// @ts-check
// Twitch Bot Handler
const Discord = require("discord.js");
const FileSystem = require("fs");
const Utils = require("./Utils.js");

global.COMMAND_CATEGORIES = {
    BEAT_SABER: {
        NAME: "Beat Saber",
        ICON: "<a:Sabers:943094868882915388>"
    },
    CHRISTMAS: {
        NAME: "Christmas",
        ICON: "<:PandaSantaCookie:918653194270289971>"
    },
    FUN: {
        NAME: "Fun",
        ICON: ":game_die:"
    },
    GAME_SPECIFIC: {
        NAME: "Game Specific",
        ICON: ":video_game:"
    },
    GUILD_SETTINGS: {
        NAME: "Guild Settings",
        ICON: ":gear:"
    },
    UTILITY: {
        NAME: "Utility",
        ICON: ":wrench:"
    }
}

var commands = new Discord.Collection();
var path_map = new Discord.Collection();

function EnumerateDirectories(path) {
    var directories = FileSystem.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (var i = 0; i < directories.length; i++) directories[i] = path + "/" + directories[i];

    return directories;
}

function LoadCommands(dir = "./") {
    /**************************** Setup Commands ****************************/
    commands = new Discord.Collection();

    console.log(`${Utils.GetTimeStamp()} [Command Handler] Loading commands.`);

    var command_files = [];
    var command_dirs = EnumerateDirectories(dir); // Gets all folders in ./Assets/Commands
    command_dirs.push(dir); // Add the root command folder itself

    //Enumerate Command Files
    for (var i = 0; i < command_dirs.length; i++) {                                                        // Go through each directory
        var temp = FileSystem.readdirSync(command_dirs[i]).filter(files => files.endsWith(".js"))          // Load command files from directory
        for (var j = 0; j < temp.length; j++) {                                                            // Get each file's path
            command_files.push(command_dirs[i] + "/" + temp[j]);                                           // Push path to array
            console.log(`${Utils.GetTimeStamp()} [Command Handler] Found ${command_dirs[i]}/${temp[j]}`);  // Log findings
        }
    }

    // Push commands to command collection
    var depth = "";

    for (var i = 0; i < dir.split("/").length - 1; i++) depth += "../";

    for (var file of command_files) {
        var command = require(`${depth}${file}`);
        path_map.set(command, file);
        if (VerifyCommand(file, command)) {
            commands.set(command.name, command);
            console.log(`${Utils.GetTimeStamp()} [Command Handler] Loaded ${file}`);
        } else {
            console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] ${file} was not loaded`);
        }
    }

    console.log(`${Utils.GetTimeStamp()} [Command Handler] Found and loaded ${command_files.length} commands.`);
}

function GetCommands() {
    return commands;
}

function VerifyCommand(path, command) {
    var is_valid = true;
    var filename = path.split("/")[path.split("/").length - 1];

    if (typeof command.NSFW != "boolean") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <boolean:NSFW> in ${filename}`);
        is_valid = false;
    }

    if (typeof command.name != "string") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <string:name> in ${filename}`);
        is_valid = false;
    }

    if (typeof command.aliases != "object") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <string[]:aliases> in ${filename}`);
        is_valid = false;
    }

    if (typeof command.aliases === "object")
        if (command.aliases.length === 0) {
            console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <aliases[ string[]:args ]> in ${filename}`);
            console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Command is not callable`);
        }

    if (typeof command.Run != "function") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <function:Run> in ${filename}`);
        is_valid = false;
    }

    for (var c of Array.from(commands.values())) {
        if (c.name === command.name) {
            throw new Error(`${Utils.GetTimeStamp()} [Command Handler] [ERROR] Duplicate command names found!\nSource A: ${path}\nSource B: ${path_map.get(c)}`);
        }
    }

    return is_valid;
}

function Resolve(channel, tags, msg, self, client, args, args_with_case) {
    for (var command of commands) {
        var temp = command[1].aliases;

        for (var variation of temp) {
            if (JSON.stringify(args.slice(0, variation.length)) === JSON.stringify(variation) && variation.length > 0) {                
                if (command[1].Run(channel, tags, msg, self, client, args, args_with_case))
                    console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${command[1].name}"`);
                else
                    console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Failed to execute command "${command[1].name}"`);
                return;
            }
        }
    }
}

module.exports = {
    LoadCommands,
    GetCommands,
    Resolve
}