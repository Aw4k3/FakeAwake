"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Discord = __importStar(require("discord.js"));
const DiscordVoice = __importStar(require("@discordjs/voice"));
const Ytdl = __importStar(require("ytdl-core"));
const YtSearch = __importStar(require("yt-search"));
const CommandHandler = __importStar(require("../../CommandHandler.js"));
const Utility = __importStar(require("../../../helpers/Utility.js"));
let streams = new Map();
var PLAYER_STATE;
(function (PLAYER_STATE) {
    PLAYER_STATE[PLAYER_STATE["IDLE"] = 0] = "IDLE";
    PLAYER_STATE[PLAYER_STATE["PLAYING"] = 1] = "PLAYING";
    PLAYER_STATE[PLAYER_STATE["PAUSED"] = 2] = "PAUSED";
    PLAYER_STATE[PLAYER_STATE["BUFFERING"] = 3] = "BUFFERING";
})(PLAYER_STATE || (PLAYER_STATE = {}));
;
const STATE_COLOURS = {
    IDLE: "#ebd234",
    PLAYING: "#3deb34",
    PAUSED: "#000000",
    BUFFERING: "eb3434"
};
const YOUTUBE_REGEX = new RegExp("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$");
const URL_REGEX = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)");
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
    .setStyle(Discord.ButtonStyle.Primary);
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
    player = DiscordVoice.createAudioPlayer();
    connection = null;
    voiceChannel = null;
    textChannel;
    controlPanel = null;
    playerState = PLAYER_STATE.IDLE;
    queue = [];
    loop = false;
    constructor(vc, tc) {
        this.voiceChannel = vc;
        this.textChannel = tc;
        this.connection = DiscordVoice.joinVoiceChannel({ channelId: this.voiceChannel.id, guildId: this.voiceChannel.guild.id, adapterCreator: this.voiceChannel.guild.voiceAdapterCreator });
        this.connection.subscribe(this.player);
        this.player.on("error", this.OnPlayerErrorHandler);
    }
    OnPlayerErrorHandler(error) {
        console.error(`${Utility.GenerateTimestamp()} [AudioPlayer] ${error.message}`);
    }
    GenerateEmbed() {
        let description = [];
        if (this.queue.length > 0) {
            description.push("**Current Track**");
            description.push(`> [${this.queue[0].title}](${this.queue[0].url}) ~ ${FormatTime(this.queue[0].duration)}`);
            description.push("");
        }
        else if (this.queue.length > 1) {
            description.push("**Next Track**");
            description.push(`> [${this.queue[1].title}](${this.queue[1].url}) ~ ${FormatTime(this.queue[1].duration)}`);
            description.push("");
        }
        else if (this.queue.length > 2) {
            let count = 10;
            if (this.queue.length < 10)
                count = this.queue.length;
            description.push("**Rest of Queue**");
            for (var i = 0; i < count; i++)
                description.push(`> [${this.queue[i].title}](${this.queue[i].url}) ~ ${FormatTime(this.queue[i].duration)}`);
        }
        else {
            description = ["Queue empty"];
        }
        let embed = new Discord.EmbedBuilder();
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
    async ShowControlPanel() {
        this.controlPanel = await this.textChannel.send({ embeds: [this.GenerateEmbed()] });
    }
    ReloadControlPanel() {
        if (this.controlPanel == null)
            this.ShowControlPanel();
        else
            this.controlPanel.edit({ embeds: [this.GenerateEmbed()] });
    }
    async AddToQueue(url) {
        if (Ytdl.validateURL(url)) {
            let info = await Ytdl.getBasicInfo(url);
            this.queue.push(new Track(url, info.videoDetails.title, parseInt(info.videoDetails.lengthSeconds, 10)));
        }
    }
    async Play() {
        if (this.queue.length > 0) {
            let audioStream = await Ytdl.default(this.queue[0].url, { highWaterMark: (1 << 25) * 2 });
            this.player.play(DiscordVoice.createAudioResource(audioStream));
            this.playerState = PLAYER_STATE.PLAYING;
        }
    }
    Stop() {
        this.player.stop();
        this.playerState = PLAYER_STATE.IDLE;
    }
    Pause() {
        this.player.pause();
        this.playerState = PLAYER_STATE.PAUSED;
    }
    Unpause() {
        this.player.unpause();
        this.playerState = PLAYER_STATE.PLAYING;
    }
}
class Track {
    url = "";
    title = "";
    duration = -1;
    constructor(url, title, duration) {
        this.url = url;
        this.title = title;
        this.duration = duration;
    }
}
function FormatTime(value) {
    var s_hours, s_min, s_sec;
    var sec_num = parseInt(value, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        s_hours = "0" + hours.toString();
    }
    else
        s_hours = hours.toString();
    if (minutes < 10) {
        s_min = "0" + minutes.toString();
    }
    else
        s_min = minutes.toString();
    if (seconds < 10) {
        s_sec = "0" + seconds.toString();
    }
    else
        s_sec = seconds.toString();
    return s_hours + ':' + s_min + ':' + s_sec;
}
exports.command = {
    name: "Music Player",
    category: "Utility",
    nsfw: false,
    aliases: [["play"]],
    devMode: false,
    Run: async function (message, args, argswithcase, client) {
        if (!message.member.voice.channel) {
            message.channel.send(`${message.author}, You must be connected to a voice channel.`);
            return CommandHandler.ExitCode.UsageError;
        }
        let voiceChannel = await message.member.voice.channel;
        if (voiceChannel == null) {
            CommandHandler.Log(`Failed to get vc`);
            message.channel.send("Failed to get vc");
            return CommandHandler.ExitCode.InternalError;
        }
        if (!voiceChannel.joinable) {
            CommandHandler.Log(`I can't join this vc`);
            message.channel.send("I can't join this vc");
            return CommandHandler.ExitCode.UsageError;
        }
        if (!streams.has(message.guild.id))
            streams.set(message.guild.id, new Stream(voiceChannel, message.channel));
        let workingStream = streams.get(message.guild.id);
        argswithcase.shift();
        if (/(http:\/\/)|(https:\/\/)/gi.test(message.content)) {
            for (let url of argswithcase)
                await workingStream.AddToQueue(url);
        }
        else {
            let results = await YtSearch(argswithcase.join(" "));
            console.log(results.videos[0]);
            workingStream.AddToQueue(results.videos[0]);
        }
        workingStream.ShowControlPanel();
        workingStream.Play();
        return CommandHandler.ExitCode.Success;
    }
};
