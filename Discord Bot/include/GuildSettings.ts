import * as FileSystem from "fs";
import * as BotSettings from "../include/BotSettings.js";

export interface IGuildSettings {
    prefix: string;
    nsfw: boolean;
}

const DEFAULT_SETTINGS: IGuildSettings = {
    prefix: ".",
    nsfw: true
};

const FILEPATH = "./data/GuildSettings.json";
let data: Map<string, IGuildSettings> = new Map<string, IGuildSettings>(Object.entries(JSON.parse(FileSystem.readFileSync(FILEPATH, "utf-8"))));

export function Reload(): void {
    data = JSON.parse(FileSystem.readFileSync(FILEPATH, "utf-8"));
}

function Save(): void {
    FileSystem.writeFileSync(FILEPATH, JSON.stringify(data, null, 2));
}

function Validate(): void {
    // Clean up
    let removelist = [];
    for (let [id, settings] of data) if (settings == DEFAULT_SETTINGS) removelist.push(id); // Add to a deletion list since the map isn't mutable at this time
    for (let id of removelist) data.delete(id);
}

export function GetData(): Map<string, IGuildSettings> {
    return data;
}

export function SetPrefix(id: string, prefix: string): void {
    if (!data.has(id)) data.set(id, { prefix: prefix, nsfw: DEFAULT_SETTINGS.nsfw });
    else data.get(id).prefix = prefix;
    Validate();
    Save();
}

export function GetPrefix(id: string): string {
    return data.get(id).prefix || BotSettings.PREFIX;
}

export function SetNsfw(id: string, nsfw: boolean): void {
    if (!data.has(id)) data.set(id, { prefix: DEFAULT_SETTINGS.prefix, nsfw: nsfw });
    else data.get(id).nsfw = nsfw;
    Validate();
    Save();
}