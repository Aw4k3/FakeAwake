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
exports.Log = exports.LogWarning = exports.LogError = exports.LogDebug = exports.Resolve = exports.GetCommands = exports.LoadCommands = exports.ExitCode = void 0;
const FileSystem = __importStar(require("fs"));
const Utility = __importStar(require("../helpers/Utility.js"));
const DEV_MODE = process.env.FAKEAWAKE_BRANCH == "dev";
let commands = new Map();
var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["Success"] = 0] = "Success";
    ExitCode[ExitCode["InternalError"] = 1] = "InternalError";
    ExitCode[ExitCode["UsageError"] = 2] = "UsageError";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
function RecursiveReadDirSync(directory) {
    let files = [];
    const items = FileSystem.readdirSync(directory, { withFileTypes: true });
    for (let item of items) {
        if (item.isDirectory()) {
            files = files.concat(RecursiveReadDirSync(`${directory}/${item.name}`));
        }
        else {
            files.push(`${directory}/${item.name}`);
            Log(`[Command Handler] Found ${directory}/${item.name}`);
        }
    }
    return files;
}
function LoadCommands(client) {
    if (DEV_MODE)
        process.title = "FakeAwake Discord Bot (Dev Mode)";
    else
        process.title = "FakeAwake Discord Bot";
    Log(`[Command Handler] Loading commands`);
    let files = RecursiveReadDirSync("src/commands");
    for (var i = 0; i < files.length; i++)
        files[i] = "../" + files[i];
    for (let file of files) {
        let _command = require(file);
        let command = _command.command;
        commands.set(command.name, command);
        Log(`[Command Handler] Loaded ${file}`);
        if (typeof command.Initialise == "function") {
            command.Initialise(client);
            Log(`[Command Handler] Found and executed initialiser in "${command.name}"`);
        }
    }
    Log(`[Command Handler] Loaded ${commands.size} commands`);
}
exports.LoadCommands = LoadCommands;
function GetCommands() {
    return commands;
}
exports.GetCommands = GetCommands;
async function Resolve(message, args, argswithcase, client) {
    for (let command of commands.values()) {
        for (let alias of command.aliases) {
            if (alias.every((arg, i) => arg == args[i])) {
                LogDebug(`Dev Mode: ${DEV_MODE} | Command Mode: ${command.devMode}`);
                if (!DEV_MODE && command.devMode) {
                    LogWarning(`${message.author.tag} tried to executed "${command.name}"`);
                    LogWarning(`The command "${command.name}" is in dev mode. Enable dev mode to allow this command to run.`);
                    return;
                }
                switch (await command.Run(message, args, argswithcase, client)) {
                    case ExitCode.Success:
                        Log(`[Command Handler] ${message.author.tag} successfully executed "${command.name}"`);
                        return;
                    case ExitCode.InternalError:
                        LogWarning(`[Command Handler] Internal error in "${command.name}"`);
                        return;
                    case ExitCode.UsageError:
                        LogError(`[Command Handler] ${message.author.tag} tried to executed "${command.name}"`);
                        return;
                }
            }
        }
    }
}
exports.Resolve = Resolve;
function LogDebug(debugMessage) {
    console.log(`\x1b[35m${Utility.GenerateTimestamp()} [Debug] ${debugMessage}\x1b[0m`);
}
exports.LogDebug = LogDebug;
function LogError(errorMessage) {
    console.log(`\x1b[31m${Utility.GenerateTimestamp()} [Error] ${errorMessage}\x1b[0m`);
}
exports.LogError = LogError;
function LogWarning(warningMessage) {
    console.log(`\x1b[33m${Utility.GenerateTimestamp()} [Warning] ${warningMessage}\x1b[0m`);
}
exports.LogWarning = LogWarning;
function Log(message) {
    console.log(`\x1b[0m${Utility.GenerateTimestamp()} ${message}\x1b[0m`);
}
exports.Log = Log;
