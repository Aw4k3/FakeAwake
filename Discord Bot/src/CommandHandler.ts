import * as Discord from "discord.js";
import * as FileSystem from "fs";
import * as Utility from "../include/Utility.js";

let commands = new Map<string, ICommand>();

export interface ICommand {
    name: string;
    category: "Fun" | "Settings" | "Utility";
    nsfw: boolean;
    aliases: string[][];
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
            console.log(`${Utility.GenerateTimestamp()} [Command Handler] Found ${directory}/${item.name}`);
        }
    }

    return files;
}

export function LoadCommands(): void {
    console.log(`${Utility.GenerateTimestamp()} [Command Handler] Loading commands`);
    let files = RecursiveReadDirSync("src/commands");
    for (var i = 0; i < files.length; i++) files[i] = "../" + files[i];

    for (let file of files) {
        let _command = require(file);
        let command = _command.command;
        commands.set(command.name, command);
        console.log(`${Utility.GenerateTimestamp()} [Command Handler] Loaded ${file}`);
    }

    console.log(`${Utility.GenerateTimestamp()} [Command Handler] Loaded ${commands.size} commands`);
}

export async function Resolve(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<void> {
    for (let command of commands.values()) {
        for (let alias of command.aliases) {
            if (alias.every((arg, i) => arg == args[i]))
                switch (await command.Run(message, args, argswithcase, client)) {
                    case ExitCode.Success:
                        console.log(`\x1b[0m${Utility.GenerateTimestamp()} [Command Handler] ${message.author.tag} successfully executed "${command.name}"\x1b[0m`);
                        return;

                    case ExitCode.InternalError:
                        console.log(`\x1b[31m${Utility.GenerateTimestamp()} [Command Handler] Internal error in "${command.name}"\x1b[0m`);
                        return;

                    case ExitCode.UsageError:
                        console.log(`\x1b[33m${Utility.GenerateTimestamp()} [Command Handler] ${message.author.tag} tried to executed "${command.name}"\x1b[0m`);
                        return;
                }
        }
    }
}