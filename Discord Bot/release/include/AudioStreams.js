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
<<<<<<< HEAD
exports.ShowControlPanel = exports.CreateStreamFromMember = exports.CreateStream = void 0;
const Discord = __importStar(require("discord.js"));
const DiscordVoice = __importStar(require("@discordjs/voice"));
let streams = new Map();
var TRACK_TYPE;
(function (TRACK_TYPE) {
    TRACK_TYPE[TRACK_TYPE["UNSET"] = -1] = "UNSET";
    TRACK_TYPE[TRACK_TYPE["YOUTUBE"] = 0] = "YOUTUBE";
    TRACK_TYPE[TRACK_TYPE["SPOTIFY"] = 1] = "SPOTIFY";
})(TRACK_TYPE || (TRACK_TYPE = {}));
;
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
=======
exports.CreateStreamFromMember = exports.CreateStream = void 0;
const Discord = __importStar(require("discord.js"));
const DiscordVoice = __importStar(require("@discordjs/voice"));
let streams = new Map();
>>>>>>> de6af06c0227b19ea0188b34016c35868b4c8964
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
    controlPanel = new Discord.EmbedBuilder()
        .setTitle("Control Panel")
        .setColor(STATE_COLOURS.IDLE);
    constructor(vc, tc) {
        this.voiceChannel = vc;
        this.textChannel = tc;
    }
    ShowControlPanel() {
        this.textChannel.send({ embeds: [this.controlPanel] });
    }
    Play(resource) {
        this.player.play(resource);
    }
}
class Track {
    type = TRACK_TYPE.UNSET;
    source = "";
    duration = -1;
    addedBy;
}
function CreateStream(vc, tc) {
    if (!streams.has(vc.id))
        streams.set(vc.id, new Stream(vc, tc));
}
exports.CreateStream = CreateStream;
async function CreateStreamFromMember(member, tc) {
    let vc = await member.voice.channel;
    if (vc == null)
        return;
    if (!streams.has(vc.id))
        streams.set(vc.id, new Stream(vc, tc));
}
exports.CreateStreamFromMember = CreateStreamFromMember;
function ShowControlPanel() {
}
exports.ShowControlPanel = ShowControlPanel;
