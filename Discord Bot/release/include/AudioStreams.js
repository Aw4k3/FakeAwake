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
exports.CreateStreamFromMember = exports.CreateStream = void 0;
const DiscordVoice = __importStar(require("@discordjs/voice"));
let streams = new Map();
class Stream {
    player = DiscordVoice.createAudioPlayer();
    connection = null;
    voicechannel = null;
    textchannel;
    constructor(vc, tc) {
        this.voicechannel = vc;
        this.textchannel = tc;
    }
    Play(resource) {
        this.player.play(resource);
    }
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
