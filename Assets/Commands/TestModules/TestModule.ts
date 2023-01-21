import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as GoogleTts from "google-tts-api";
import * as Utils from "../../include/Utils.js";

var vc: Discord.VoiceBasedChannel;
var connection: DiscordVoice.VoiceConnection;
var audioplayer: DiscordVoice.AudioPlayer = new DiscordVoice.AudioPlayer();

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {
    vc = await message.member.voice.channel;
    if (vc == null) {
        message.channel.send(`${message.member.user} vc?`);
        return true;
    }

    connection = DiscordVoice.joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator as unknown as DiscordVoice.DiscordGatewayAdapterCreator
    });

    // Event Handlers
    connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, DisconnectHandler);
    audioplayer.on("error", PlayerErrorHandler);

    // Stream Audio
    var audiostream = await GoogleTts.getAllAudioUrls("I am Fake Awake", { lang: "en" });
    for (var i = 0; i < audiostream.length; i++) {
        var audioresource = DiscordVoice.createAudioResource(audiostream[i].url, { inputType: DiscordVoice.StreamType.Opus });
        connection.subscribe(audioplayer);
        audioplayer.play(audioresource);
    }

    return true;
}

// Event Handlers
function DisconnectHandler(): void {
    try {
        DiscordVoice.entersState(connection, DiscordVoice.VoiceConnectionStatus.Signalling, 5000);
        DiscordVoice.entersState(connection, DiscordVoice.VoiceConnectionStatus.Connecting, 5000);
    } catch(e) {
        console.log(`${Utils.GetTimeStamp()} ${e}`);
        connection.destroy();
    }
}

function PlayerErrorHandler(error): void {
    console.log(`${Utils.GetTimeStamp()} Error: ${error.message} with resource ${error.resource.metadata.title}`);
    connection.destroy();
}

export const NSFW: boolean = false;
export const title: string = "TestModuleTs";
export const category: string = global.COMMAND_CATEGORIES.UTILITY.NAME;
export const aliases: string[][] = [
    ["test"]
];