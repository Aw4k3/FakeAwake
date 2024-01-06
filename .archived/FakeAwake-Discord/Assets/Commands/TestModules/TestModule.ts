import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as GoogleTts from "google-tts-api";
import * as Utils from "../../include/Utils.js";

var vc: Discord.VoiceBasedChannel;
var connection: DiscordVoice.VoiceConnection;
var audioplayer: DiscordVoice.AudioPlayer = new DiscordVoice.AudioPlayer();

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {

    return true;
}

export const NSFW: boolean = false;
export const title: string = "TestModuleTs";
export const category: string = global.COMMAND_CATEGORIES.UTILITY.NAME;
export const aliases: string[][] = [
    ["test"]
];