import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";

let streams: Map<string, Stream> = new Map<string, Stream>(); // <VoiceChannel.Id, Stream>

/*********** BUTTONS ***********/
const PLAY_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("play")
    .setLabel("Play")
    .setStyle(Discord.ButtonStyle.Danger);

const PAUSE_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("pause")
    .setLabel("Pause")
    .setStyle(Discord.ButtonStyle.Primary);

const SKIP_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("skip")
    .setLabel("Skip")
    .setStyle(Discord.ButtonStyle.Primary)

const LOOP_ENABLED_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("disable-loop")
    .setLabel("Loop")
    .setStyle(Discord.ButtonStyle.Success);

const LOOP_DISABLED_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("enable-loop")
    .setLabel("Loop")
    .setStyle(Discord.ButtonStyle.Secondary);

const STAY_ENABLED_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("stay-on-finish")
    .setLabel("Stay on Finish")
    .setStyle(Discord.ButtonStyle.Success);

const STAY_DISABLED_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("stay-on-finish")
    .setLabel("Stay on Finish")
    .setStyle(Discord.ButtonStyle.Secondary);

const CLEAR_QUEUE_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("clear")
    .setLabel("Clear Queue")
    .setStyle(Discord.ButtonStyle.Danger)
    .setDisabled(true);

const DISCONNECT_BUTTON = new Discord.ButtonBuilder()
    .setCustomId("disconnect")
    .setLabel("Disconnect")
    .setStyle(Discord.ButtonStyle.Danger);

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