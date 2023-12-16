import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";

let streams: Map<string, Stream> = new Map<string, Stream>(); // <VoiceChannel.Id, Stream>

enum TRACK_TYPE { UNSET = -1, YOUTUBE, SPOTIFY };
enum PLAYER_STATE { IDLE, PLAYING, PAUSED, BUFFERING };
const STATE_COLOURS = {
    IDLE: "#ebd234" as Discord.ColorResolvable,
    PLAYING: "#3deb34" as Discord.ColorResolvable,
    PAUSED: "#000000" as Discord.ColorResolvable,
    BUFFERING: "eb3434" as Discord.ColorResolvable
}

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
    private voiceChannel: Discord.VoiceBasedChannel = null;
    private textChannel: Discord.TextBasedChannel;
    private controlPanel: Discord.EmbedBuilder = new Discord.EmbedBuilder()
        .setTitle("Control Panel")
        .setColor(STATE_COLOURS.IDLE);

    public constructor(vc: Discord.VoiceBasedChannel, tc: Discord.TextBasedChannel) {
        this.voiceChannel = vc;
        this.textChannel = tc;
    }

    public ShowControlPanel() {
        this.textChannel.send({ embeds: [this.controlPanel] });
    }

    public Play(resource: DiscordVoice.AudioResource) {
        this.player.play(resource);
    }
}

class Track {
    private type: TRACK_TYPE = TRACK_TYPE.UNSET;
    private source: string = "";
    private duration: number = -1;
    private addedBy: Discord.User;
}

export function CreateStream(vc: Discord.VoiceBasedChannel, tc: Discord.TextBasedChannel) {
    if (!streams.has(vc.id)) streams.set(vc.id, new Stream(vc, tc));
}

export async function CreateStreamFromMember(member: Discord.GuildMember, tc: Discord.TextBasedChannel) {
    let vc = await member.voice.channel;
    if (vc == null) return;
    if (!streams.has(vc.id)) streams.set(vc.id, new Stream(vc, tc));
}

export function ShowControlPanel(): void {

}