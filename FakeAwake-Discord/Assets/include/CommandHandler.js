// @ts-check

const Discord = require("discord.js");
const FileSystem = require("fs");
const GuildSettings = require("./GuildSettings.js");
const Random = require("./Random.js");
const Status = require("./Status.js");

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

const HELP_TITLES = [
    "Linus Tech Tips",
    "Linus Sex Tips",
    "Linus Finger Tips",
    "Oculus Support",
    "Steam Support",
    "Big Bojo Hotline (Boris Johnson)",
    "Billy's guide on how to get Waifus"
];

var help_menu = new Discord.MessageEmbed()
    .setColor(Status.StatusColor("OK"))
    .setFooter("Commands List");

var Utils = null;

try {
    Utils = require("./Utils.js");
} catch (e) {
    var Utils = { getTimeStamp: null };
    Utils.getTimeStamp = function () { return ""; }
}

var commands = new Discord.Collection();
var path_map = new Discord.Collection();

class Category {
    name = "";
    icon = "";
    commands_aliases = [];
    commands_aliases_sfw = [];

    StringifyAliases(aliases) {
        var s = [];
        for (var variant of aliases) s.push(variant.join(" "));
        return s.join("|")
    }

    Add(command) {
        if (this.StringifyAliases(command.aliases).length < 1) return;
        this.commands_aliases.push(`\`${this.StringifyAliases(command.aliases)}\` `);
        if (!command.NSFW) this.commands_aliases_sfw.push(`\`${this.StringifyAliases(command.aliases)}\` `);
    }

    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
    }
}

var categories = [];

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
            commands.set(command.name || command.title, command);
            console.log(`${Utils.GetTimeStamp()} [Command Handler] Loaded ${file}`);
        } else {
            console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] ${file} was not loaded`);
        }
    }

    console.log(`${Utils.GetTimeStamp()} [Command Handler] Found and loaded ${command_files.length} commands.`);

    /**************************** Generate Help Menus ****************************/
    for (var key of Object.keys(COMMAND_CATEGORIES)) categories.push(new Category(COMMAND_CATEGORIES[key].NAME, COMMAND_CATEGORIES[key].ICON));

    for (var command of commands) {
        if (typeof command[1].category == "string") {
            for (var category of categories)
                if (category.name == command[1].category)
                    category.Add(command[1]);
        }
    }
}

function GetHelpMenu(SFW = false) {
    help_menu.setTitle(HELP_TITLES[Random.RandInt(0, HELP_TITLES.length)]);

    var fields = [];

    if (SFW) for (var category of categories) fields.push({ name: `${category.icon} ${category.name}`, value: category.commands_aliases_sfw.join("")});
    else for (var category of categories) fields.push({ name: `${category.icon} ${category.name}`, value: category.commands_aliases.join("") });

    help_menu.setFields(fields);

    return help_menu;
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

    if (typeof command.title != "string" && typeof command.name != "string") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <string:name> in ${filename}`);
        is_valid = false;
    }

    if (typeof command.aliases != "object") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <string[]:aliases> in ${filename}`);
        is_valid = false;
    }

    if (typeof command.aliases == "object")
        if (command.aliases.length == 0) {
            console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <aliases[string[]:args]> in ${filename}`);
            console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Command is not callable`);
        }

    if (typeof command.Run != "function") {
        console.log(`${Utils.GetTimeStamp()} [Command Handler] [WARNING] Missing <function:Run> in ${filename}`);
        is_valid = false;
    }

    for (var c of Array.from(commands.values())) {
        var x = c.name || c.title;
        var y = command.name || command.title
        if (x == y) {
            throw new Error(`${Utils.GetTimeStamp()} [Command Handler] [ERROR] Duplicate command names found!\nSource A: ${path}\nSource B: ${path_map.get(c)}`);
        }
    }

    return is_valid;
}

function Resolve(message, args, args_with_case, client) {
    for (var command of commands) {
        var temp = command[1].aliases;

        for (var variation of temp) {
            if (JSON.stringify(args.slice(0, variation.length)) === JSON.stringify(variation) && variation.length > 0) {
                var guild_configs = GuildSettings.read_config();
                if (Object.keys(guild_configs).includes(message.guild.id)) {
                    if (Object.keys(guild_configs[message.guild.id]).includes(GuildSettings.PROPERTIES.SFW)) {
                        if (guild_configs[message.guild.id][GuildSettings.PROPERTIES.SFW] === command[1].NSFW) {
                            console.log(`${Utils.GetTimeStamp()} [Command Handler] Blocked execution of command "${command[1].name}" due to server NSFW setting`);
                            return;
                        }
                    }
                }
                
                if (command[1].Run(message, args, args_with_case, client)) { console.log(`${Utils.GetTimeStamp()} [Command Handler] Successfully executed command "${command[1].name}"`); }
                return;
            }
        }
    }
}

module.exports = {
    LoadCommands,
    GetCommands,
    GetHelpMenu,
    Resolve
}