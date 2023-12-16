import * as Discord from "discord.js";
import * as FileSystem from "fs";
import * as Utility from "../helpers/Utility.js";

// Create a System Environment Variable called "FAKEAWAKE_BRANCH" and set value to "dev" to enable dev mode
const DEV_MODE: boolean = process.env.FAKEAWAKE_BRANCH == "dev";
let commands = new Map<string, ICommand>();

export interface ICommand {
    name: string;
    category: "Fun" | "Settings" | "Utility";
    nsfw: boolean;
    aliases: string[][];
    devMode: boolean;
    Initialise?: (client: Discord.Client) => void | Promise<void>;
    Run: (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client) => ExitCode | Promise<ExitCode>;
}

export enum ExitCode {
    Success,
    InternalError,
    UsageError
}

function RecursiveReadDirSync(directory: string): string[] {
    let files: string[] = [];
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

export function LoadCommands(client: Discord.Client): void {
    if (DEV_MODE) process.title = "FakeAwake Discord Bot (Dev Mode)"; else process.title = "FakeAwake Discord Bot";
    Log(`[Command Handler] Loading commands`);
    let files = RecursiveReadDirSync("src/commands");
    for (var i = 0; i < files.length; i++) files[i] = "../" + files[i];

    for (let file of files) {
        let _command = require(file);
        let command: ICommand = _command.command;
        commands.set(command.name, command);
        Log(`[Command Handler] Loaded ${file}`);
        if (typeof command.Initialise == "function") {
            command.Initialise(client);
            Log(`[Command Handler] Found and executed initialiser in "${command.name}"`);
        }
    }

    Log(`[Command Handler] Loaded ${commands.size} commands`);
}

export function GetCommands(): Map<string, ICommand> {
    return commands;
}

export async function Resolve(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<void> {
    for (let command of commands.values()) {
        for (let alias of command.aliases) {
            if (alias.every((arg, i) => arg == args[i])) {
                LogDebug(`Dev Mode: ${DEV_MODE} | Command Mode: ${command.devMode}`);
                // If dev mode is true, dev and release commands can run
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

export function LogDebug(debugMessage: string): void {
    console.log(`\x1b[35m${Utility.GenerateTimestamp()} [Debug] ${debugMessage}\x1b[0m`);
}
export function LogError(errorMessage: string): void {
    console.log(`\x1b[31m${Utility.GenerateTimestamp()} [Error] ${errorMessage}\x1b[0m`);
}

export function LogWarning(warningMessage: string): void {
    console.log(`\x1b[33m${Utility.GenerateTimestamp()} [Warning] ${warningMessage}\x1b[0m`);
}

export function Log(message: string): void {
    console.log(`\x1b[0m${Utility.GenerateTimestamp()} ${message}\x1b[0m`);
}