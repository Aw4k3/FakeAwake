import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";

let streams: Map<string, Stream> = new Map<string, Stream>(); // <VoiceChannel.Id, Stream>

class Stream {
    private player: DiscordVoice.AudioPlayer = DiscordVoice.createAudioPlayer();
    private connection: DiscordVoice.VoiceConnection = null;
    private voicechannel: Discord.VoiceBasedChannel = null;
    private textchannel: Discord.TextBasedChannel;

    public constructor(vc: Discord.VoiceBasedChannel, tc: Discord.TextBasedChannel) {
        this.voicechannel = vc;
        this.textchannel = tc;
    }

    public Play(resource: DiscordVoice.AudioResource) {
        this.player.play(resource);
    }
}

export function CreateStream(vc: Discord.VoiceBasedChannel, tc: Discord.TextBasedChannel) {
    if (!streams.has(vc.id)) streams.set(vc.id, new Stream(vc, tc));
}

export async function CreateStreamFromMember(member: Discord.GuildMember, tc: Discord.TextBasedChannel) {
    let vc = await member.voice.channel;
    if (vc == null) return;
    if (!streams.has(vc.id)) streams.set(vc.id, new Stream(vc, tc));
}