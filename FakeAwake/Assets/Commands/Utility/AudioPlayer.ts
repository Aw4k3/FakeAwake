export var NSFW: boolean = false;
export var name: string = "AudioPlayer";
export var category: string = global.COMMAND_CATEGORIES.UTILITY.NAME;
export var aliases: string[][] = [
    ["p"]
];

export function Run(): boolean {

    return true;
}