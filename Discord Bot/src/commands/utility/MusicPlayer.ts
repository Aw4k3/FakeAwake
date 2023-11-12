import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as Ytdl from "ytdl-core";
import * as YtSearch from "yt-search";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../include/Utility.js";

let streams: Map<string, Stream> = new Map<string, Stream>(); // <Guild.Id, Stream>

enum PLAYER_STATE { IDLE, PLAYING, PAUSED, BUFFERING };
const STATE_COLOURS = {
    IDLE: "#ebd234" as Discord.ColorResolvable,
    PLAYING: "#3deb34" as Discord.ColorResolvable,
    PAUSED: "#000000" as Discord.ColorResolvable,
    BUFFERING: "eb3434" as Discord.ColorResolvable
}
const YOUTUBE_REGEX: RegExp = new RegExp("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$");
const URL_REGEX: RegExp = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)");

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
    private controlPanel: Discord.Message = null;
    private playerState: PLAYER_STATE = PLAYER_STATE.IDLE;
    private queue: Track[] = [];
    private loop: boolean = false;

    public constructor(vc: Discord.VoiceBasedChannel, tc: Discord.TextBasedChannel) {
        this.voiceChannel = vc;
        this.textChannel = tc;

        this.connection = DiscordVoice.joinVoiceChannel({ channelId: this.voiceChannel.id, guildId: this.voiceChannel.guild.id, adapterCreator: this.voiceChannel.guild.voiceAdapterCreator });
        this.connection.subscribe(this.player);
        this.player.on("error", this.OnPlayerErrorHandler);
    }

    private OnPlayerErrorHandler(error: Error): void {
        console.error(`${Utility.GenerateTimestamp()} [AudioPlayer] ${error.message}`);
    }

    private GenerateEmbed(): Discord.EmbedBuilder {
        let description: string[] = [];

        if (this.queue.length > 0) {
            description.push("**Current Track**");
            description.push(`> [${this.queue[0].title}](${this.queue[0].url}) ~ ${FormatTime(this.queue[0].duration)}`);
            description.push("");
        } else if (this.queue.length > 1) {
            description.push("**Next Track**");
            description.push(`> [${this.queue[1].title}](${this.queue[1].url}) ~ ${FormatTime(this.queue[1].duration)}`);
            description.push("");
        } else if (this.queue.length > 2) {
            let count: number = 10;
            if (this.queue.length < 10) count = this.queue.length;
            description.push("**Rest of Queue**");
            for (var i = 0; i < count; i++) description.push(`> [${this.queue[i].title}](${this.queue[i].url}) ~ ${FormatTime(this.queue[i].duration)}`);
        } else {
            description = ["Queue empty"];
        }

        let embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();
        embed.setTitle("Control Panel");
        embed.setDescription(description.join("\n"));

        switch (this.playerState) {
            case PLAYER_STATE.PLAYING:
                embed.setColor(STATE_COLOURS.PLAYING);
                break;

            case PLAYER_STATE.IDLE:
                embed.setColor(STATE_COLOURS.IDLE);
                break;

            case PLAYER_STATE.PAUSED:
                embed.setColor(STATE_COLOURS.PAUSED);
                break;

            case PLAYER_STATE.BUFFERING:
                embed.setColor(STATE_COLOURS.BUFFERING);
                break;
        }

        return embed;
    }

    public async ShowControlPanel(): Promise<void> {
        this.controlPanel = await this.textChannel.send({ embeds: [ this.GenerateEmbed() ] });
    }

    public ReloadControlPanel(): void {
        if (this.controlPanel == null) this.ShowControlPanel();
        else this.controlPanel.edit({ embeds: [ this.GenerateEmbed() ] });
    }

    public async AddToQueue(url: string): Promise<void> {
        if (Ytdl.validateURL(url)) {
            let info: Ytdl.videoInfo = await Ytdl.getBasicInfo(url);
            this.queue.push(new Track(url, info.videoDetails.title, parseInt(info.videoDetails.lengthSeconds, 10)));
        }
    }

    public async Play(): Promise<void> {
        if (this.queue.length > 0) {
            let audioStream = await Ytdl.default(this.queue[0].url, { highWaterMark: (1 << 25) * 2 });
            this.player.play(DiscordVoice.createAudioResource(audioStream));
            this.playerState = PLAYER_STATE.PLAYING;
        }
    }

    public Stop(): void {
        this.player.stop();
        this.playerState = PLAYER_STATE.IDLE;
    }

    public Pause(): void {
        this.player.pause();
        this.playerState = PLAYER_STATE.PAUSED;
    }

    public Unpause(): void {
        this.player.unpause();
        this.playerState = PLAYER_STATE.PLAYING;
    }
}

class Track {
    public url: string = "";
    public title: string = "";
    public duration: number = -1;

    constructor(url: string, title: string, duration: number) {
        this.url = url;
        this.title = title;
        this.duration = duration;
    }
}
function FormatTime(value: any): string {
    var s_hours: string, s_min: string, s_sec: string;

    //Resolve
    var sec_num = parseInt(value, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    // Prettify
    if (hours < 10) { s_hours = "0" + hours.toString(); } else s_hours = hours.toString();
    if (minutes < 10) { s_min = "0" + minutes.toString(); } else s_min = minutes.toString();
    if (seconds < 10) { s_sec = "0" + seconds.toString(); } else s_sec = seconds.toString();
    return s_hours + ':' + s_min + ':' + s_sec;
}

export const command: CommandHandler.ICommand = {
    name: "Music Player",
    category: "Utility",
    nsfw: false,
    aliases: [["play"]],
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        if (!message.member.voice.channel) {
            message.channel.send(`${message.author}, You must be connected to a voice channel.`);
            return CommandHandler.ExitCode.UsageError;
        }
        /*
        if (args.length < 2) {
            message.channel.send(`${message.author}, Usage .play <string:url>`);
            return CommandHandler.ExitCode.UsageError;
        }
        */

        // Stream Management
        let voiceChannel = await message.member.voice.channel;
        if (voiceChannel == null) {
            console.log(`${Utility.GenerateTimestamp()} Failed to get vc`);
            message.channel.send("Failed to get vc");
            return CommandHandler.ExitCode.InternalError;
        }

        if (!voiceChannel.joinable) {
            console.log(`${Utility.GenerateTimestamp()} I can't join this vc`);
            message.channel.send("I can't join this vc");
            return CommandHandler.ExitCode.UsageError;
        }

        if (!streams.has(message.guild.id)) streams.set(message.guild.id, new Stream(voiceChannel, message.channel));

        // Adding Tracks
        let workingStream = streams.get(message.guild.id);
        argswithcase.shift();

        if (/(http:\/\/)|(https:\/\/)/gi.test(message.content)) {
            for (let url of argswithcase) await workingStream.AddToQueue(url);
        } else {
            let results = await YtSearch(argswithcase.join(" "));
            console.log(results.videos[0]);
            workingStream.AddToQueue(results.videos[0]);
        }
        
        // Play Audio
        workingStream.ShowControlPanel();
        workingStream.Play();

        return CommandHandler.ExitCode.Success;
    }
}