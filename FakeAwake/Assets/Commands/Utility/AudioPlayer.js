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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliases = exports.category = exports.title = exports.NSFW = exports.Run = void 0;
var Discord = __importStar(require("discord.js"));
var DiscordVoice = __importStar(require("@discordjs/voice"));
var Ytdl = __importStar(require("ytdl-core-discord"));
var YtdlCore = __importStar(require("ytdl-core"));
var YtPlaylist = __importStar(require("ytpl"));
var YtSearch = __importStar(require("yt-search"));
var FileSystem = __importStar(require("fs"));
var Status = __importStar(require("../../include/Status.js"));
var Utils = __importStar(require("../../include/Utils.js"));
var SECRETS = JSON.parse(FileSystem.readFileSync("D:\FakeAwake Secrets.json", "utf8"));
// const SPOTIFY_API: SpotifyWebApi = new SpotifyWebApi();
var instances = new Map();
var PLATFORMS;
(function (PLATFORMS) {
    PLATFORMS[PLATFORMS["UNSPECIFIED"] = -1] = "UNSPECIFIED";
    PLATFORMS[PLATFORMS["YOUTUBE"] = 0] = "YOUTUBE";
    PLATFORMS[PLATFORMS["SPOTIFY"] = 1] = "SPOTIFY";
})(PLATFORMS || (PLATFORMS = {}));
;
var PLAYER_STATE;
(function (PLAYER_STATE) {
    PLAYER_STATE[PLAYER_STATE["INITIALISING"] = 0] = "INITIALISING";
    PLAYER_STATE[PLAYER_STATE["PLAYING"] = 1] = "PLAYING";
    PLAYER_STATE[PLAYER_STATE["PAUSED"] = 2] = "PAUSED";
    PLAYER_STATE[PLAYER_STATE["IDLE"] = 3] = "IDLE";
})(PLAYER_STATE || (PLAYER_STATE = {}));
function FormatTime(value) {
    var s_hours, s_min, s_sec;
    //Resolve
    var sec_num = parseInt(value, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    // Prettify
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
/*********** SPOTIFY ***********/
/*
const SPOTIFY_AUTH_OPTIONS = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(SECRETS.Spotify.ClientID + ':' + SECRETS.Spotify.ClientSecret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

Request.post(SPOTIFY_AUTH_OPTIONS, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        var token = body.access_token;
        SPOTIFY_API.setAccessToken(token);
    }
});
*/
/*********** BUTTONS ***********/
var PLAY_BUTTON = new Discord.MessageButton()
    .setCustomId("play")
    .setLabel("Play")
    .setStyle("SUCCESS");
var PAUSE_BUTTON = new Discord.MessageButton()
    .setCustomId("pause")
    .setLabel("Pause")
    .setStyle("PRIMARY");
var SKIP_BUTTON = new Discord.MessageButton()
    .setCustomId("skip")
    .setLabel("Skip")
    .setStyle("PRIMARY");
var LOOP_ENABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("disable-loop")
    .setLabel("Loop")
    .setStyle("SUCCESS");
var LOOP_DISABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("enable-loop")
    .setLabel("Loop")
    .setStyle("SECONDARY");
var STAY_ENABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("stay-on-finish")
    .setLabel("Stay on Finish")
    .setStyle("SUCCESS");
var STAY_DISABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("stay-on-finish")
    .setLabel("Stay on Finish")
    .setStyle("SECONDARY");
var CLEAR_QUEUE_BUTTON = new Discord.MessageButton()
    .setCustomId("clear")
    .setLabel("Clear Queue")
    .setStyle("DANGER")
    .setDisabled(true);
var DISCONNECT_BUTTON = new Discord.MessageButton()
    .setCustomId("disconnect")
    .setLabel("Disconnect")
    .setStyle("DANGER");
/*********** CLASSES ***********/
var Track = /** @class */ (function () {
    function Track(url, platform, user) {
        this.url = "Unresolved";
        this.cover_url = "Unresolved";
        this.title = "Unresolved";
        this.artistname = "Unresolved";
        this.artisturl = "Unresolved";
        this.length = 0;
        this.resolved = false;
        this.url = url;
        this.platform = platform;
        this.added_by = user;
        switch (this.platform) {
            case PLATFORMS.YOUTUBE:
                this.ResolveYouTube();
                break;
        }
    }
    Track.prototype.ResolveYouTube = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, YtdlCore.getBasicInfo(this.url)];
                    case 1:
                        info = _a.sent();
                        this.cover_url = info.thumbnail_url;
                        this.title = info.videoDetails.title;
                        this.artistname = info.videoDetails.ownerChannelName;
                        this.artisturl = info.videoDetails.ownerProfileUrl;
                        this.length = parseInt(info.videoDetails.lengthSeconds, 10);
                        this.resolved = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Track.prototype.GetEmbedText = function () {
        return [
            "> [".concat(this.title, "](").concat(this.url, ")"),
            "> [".concat(this.artistname, "](").concat(this.artisturl, ")"),
            "> ".concat(FormatTime(this.length))
        ].join("\n");
    };
    Track.prototype.GetBasicEmbedText = function () {
        return "[".concat(this.title, "](").concat(this.url, ") (").concat(FormatTime(this.length), ")");
    };
    return Track;
}());
var Instance = /** @class */ (function () {
    function Instance(vc, tc) {
        this.audioplayer = new DiscordVoice.AudioPlayer();
        this.tracklist = [];
        this.playerstate = PLAYER_STATE.INITIALISING;
        this.loop = false;
        this.controlpanelcontext = { embeds: [], components: [] };
        this.controlpanelembed = new Discord.MessageEmbed();
        this.stayonfinish = false;
        this.interactioncollector = null;
        this.CONTROLS = new Discord.MessageActionRow()
            .addComponents(PAUSE_BUTTON, SKIP_BUTTON, LOOP_DISABLED_BUTTON, CLEAR_QUEUE_BUTTON);
        this.OPTIONS = new Discord.MessageActionRow()
            .addComponents(STAY_DISABLED_BUTTON, DISCONNECT_BUTTON);
        this.textchannel = tc;
        this.voicechannel = vc;
        // Connect to vc
        console.log("".concat(Utils.GetTimeStamp(), " Creating audio player instance for \"").concat(vc.guild.name, "\""));
        // Error Checking
        if (this.voicechannel == null)
            return;
        if (!vc.joinable) {
            this.textchannel.send("Unable to join vc :(");
            return;
        }
        // Join VC
        this.connection = DiscordVoice.joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator
        });
        this.connection.subscribe(this.audioplayer);
        console.log("".concat(Utils.GetTimeStamp(), " Successfully connected to voice channel at ").concat(vc.guild.name, ".").concat(vc.name));
        // Event Handlers
        this.connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, this.DisconnectHandler);
        this.audioplayer.on(DiscordVoice.AudioPlayerStatus.Idle, this.PlayerIdlingHandler);
        this.audioplayer.on("error", this.PlayerErrorHandler);
        // Setup control panel
        this.controlpanelembed = new Discord.MessageEmbed()
            .setTitle("Audio Control Panel")
            .setDescription("<a:Loading:965027668280111255> Initialising...")
            .setColor(Status.StatusColor("OK"));
        this.controlpanelcontext = {
            embeds: [this.controlpanelembed],
            components: [this.CONTROLS, this.OPTIONS]
        };
        this.SendControlPanel();
        // this.playerstate = PLAYER_STATE.IDLE;
    }
    Instance.prototype.GenerateSkipMenu = function () {
        var options = new Discord.MessageSelectMenu()
            .setCustomId("skip-to")
            .setPlaceholder("Skip to...");
        var menu = new Discord.MessageActionRow()
            .addComponents(options);
        for (var i = 1; i < 11; i++) {
            if (!this.tracklist[i])
                break;
            options.addOptions({
                label: "".concat(i + 1, ". ").concat(this.tracklist[i].title),
                value: i.toString()
            });
        }
        return menu;
    };
    Instance.prototype.BuildAndAddTracks = function (context, user) {
        return __awaiter(this, void 0, void 0, function () {
            var playlist, _a, _b, _i, _c, v, result, url;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!/(http:\/\/)|(https:\/\/)/gi.test(context)) return [3 /*break*/, 5];
                        if (!(YtdlCore.validateURL(context) || YtPlaylist.validateID(context))) return [3 /*break*/, 4];
                        if (!context.includes("list")) return [3 /*break*/, 3];
                        _b = (_a = YtPlaylist).default;
                        return [4 /*yield*/, YtPlaylist.getPlaylistID(context)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_d.sent(), { limit: Infinity }])];
                    case 2:
                        playlist = _d.sent();
                        for (_i = 0, _c = playlist.items; _i < _c.length; _i++) {
                            v = _c[_i];
                            this.tracklist.push(new Track(v.url, PLATFORMS.YOUTUBE, user));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.tracklist.push(new Track(context, PLATFORMS.YOUTUBE, user));
                        _d.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, YtSearch.search(context)];
                    case 6:
                        result = _d.sent();
                        url = result.videos[0].url;
                        this.tracklist.push(new Track(url, PLATFORMS.YOUTUBE, user));
                        _d.label = 7;
                    case 7:
                        if (this.playerstate == PLAYER_STATE.IDLE || this.playerstate == PLAYER_STATE.INITIALISING)
                            this.Play();
                        else
                            this.SendControlPanel();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Control Functions
    Instance.prototype.Play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var audiostream, audioresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Error Checking
                        if (this.voicechannel == null)
                            return [2 /*return*/];
                        if (!this.voicechannel.joinable) {
                            this.textchannel.send("Unable to join vc :(");
                            return [2 /*return*/];
                        }
                        if (this.playerstate == PLAYER_STATE.IDLE)
                            return [2 /*return*/];
                        this.playerstate = PLAYER_STATE.PLAYING;
                        return [4 /*yield*/, Ytdl.default(this.tracklist[0].url, { highWaterMark: (1 << 25) * 2 })];
                    case 1:
                        audiostream = _a.sent();
                        audioresource = DiscordVoice.createAudioResource(audiostream, { inputType: DiscordVoice.StreamType.Opus });
                        this.audioplayer.play(audioresource);
                        console.log("".concat(Utils.GetTimeStamp(), " Play audio to ").concat(this.voicechannel.guild.name, "->").concat(this.voicechannel.name));
                        this.SendControlPanel();
                        return [2 /*return*/];
                }
            });
        });
    };
    Instance.prototype.Pause = function () {
        if (this.playerstate == PLAYER_STATE.PAUSED)
            return;
        this.audioplayer.pause();
        this.controlpanelembed.setColor("#000000");
        this.CONTROLS.components[0] = PLAY_BUTTON;
        this.playerstate = PLAYER_STATE.PAUSED;
        this.SendControlPanel();
    };
    Instance.prototype.UnPause = function () {
        if (this.playerstate == PLAYER_STATE.PLAYING)
            return;
        this.audioplayer.unpause();
        this.controlpanelembed.setColor(Status.StatusColor("OK"));
        this.CONTROLS.components[0] = PAUSE_BUTTON;
        this.playerstate = PLAYER_STATE.PLAYING;
        this.SendControlPanel();
    };
    Instance.prototype.Stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.audioplayer.stop();
                        this.connection.disconnect();
                        this.connection.destroy();
                        delete this.tracklist;
                        this.controlpanelembed.setDescription("Done innit");
                        this.controlpanelcontext.components = [];
                        if (!(this.controlpanel == null)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.textchannel.send(this.controlpanelcontext)];
                    case 1:
                        _a.controlpanel = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.controlpanel.edit(this.controlpanelcontext);
                        _b.label = 3;
                    case 3:
                        Instance.DestroyInstance(this.voicechannel.guild.id);
                        return [2 /*return*/];
                }
            });
        });
    };
    Instance.DestroyInstance = function (g_id) {
        instances.delete(g_id);
    };
    Instance.prototype.NextTrack = function (count) {
        if (count === void 0) { count = 1; }
        if (count < 1)
            return;
        if (count >= this.tracklist.length)
            return;
        this.tracklist.splice(0, count);
        this.Play();
    };
    Instance.prototype.ToggleLoop = function () {
        if (this.loop) {
            this.loop = false;
            this.CONTROLS.components[2] = LOOP_DISABLED_BUTTON;
        }
        else {
            this.loop = true;
            this.CONTROLS.components[2] = LOOP_ENABLED_BUTTON;
        }
        this.SendControlPanel();
    };
    Instance.prototype.ToggleStayOnFinish = function () {
        if (this.stayonfinish) {
            this.stayonfinish = false;
            this.OPTIONS.components[0] = STAY_DISABLED_BUTTON;
        }
        else {
            this.stayonfinish = true;
            this.OPTIONS.components[0] = STAY_ENABLED_BUTTON;
        }
        this.SendControlPanel();
    };
    Instance.prototype.SendControlPanel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, i;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = [];
                        if (!(this.controlpanel == null)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.textchannel.send(this.controlpanelcontext)];
                    case 1:
                        _a.controlpanel = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.interactioncollector = this.controlpanel.createMessageComponentCollector({ max: 1 });
                        this.interactioncollector.on("collect", function (i) {
                            switch (i.customId) {
                                case "play":
                                    _this.UnPause();
                                    break;
                                case "pause":
                                    _this.Pause();
                                    break;
                                case "skip":
                                    _this.NextTrack();
                                    break;
                                case "enable-loop":
                                case "disable-loop":
                                    _this.ToggleLoop();
                                    break;
                                case "stay-on-finish":
                                    _this.ToggleStayOnFinish();
                                    break;
                                case "disconnect":
                                    _this.Stop();
                                    break;
                                case "skip-to":
                                    _this.NextTrack(parseInt(i.values[0], 10));
                                    break;
                            }
                            i.deferUpdate();
                        });
                        if (!(this.tracklist.length < 1)) return [3 /*break*/, 3];
                        result.push("Queue Empty");
                        this.controlpanelembed.setDescription(result.join("\n"));
                        this.controlpanel.edit(this.controlpanelcontext);
                        return [3 /*break*/, 9];
                    case 3:
                        result.push("<a:Loading:965027668280111255> Resolving Queue...");
                        this.controlpanelembed.setDescription(result.join("\n"));
                        this.controlpanel.edit(this.controlpanelcontext);
                        this.controlpanelcontext = { embeds: [this.controlpanelembed], components: [this.CONTROLS, this.OPTIONS] };
                        i = 0;
                        _b.label = 4;
                    case 4:
                        if (!(i < this.tracklist.length)) return [3 /*break*/, 8];
                        if (i > 11)
                            return [3 /*break*/, 8];
                        if (!!this.tracklist[i].resolved) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.tracklist[i].ResolveYouTube()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        switch (i) {
                            case 0:
                                result.push("**Currently Playing**");
                                result.push(this.tracklist[i].GetEmbedText());
                                break;
                            case 1:
                                result.push("**Next Up**");
                                result.push(this.tracklist[i].GetEmbedText());
                                break;
                            default:
                                result.push("**".concat(i + 1, ".** ").concat(this.tracklist[i].GetBasicEmbedText()));
                                break;
                        }
                        if (i == this.tracklist.length - 1)
                            return [3 /*break*/, 8];
                        _b.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 4];
                    case 8:
                        result.shift(); // Remove "resolving" header
                        this.controlpanelembed.setDescription(result.join("\n"));
                        if (this.tracklist.length > 2)
                            this.controlpanelcontext = { embeds: [this.controlpanelembed], components: [this.CONTROLS, this.OPTIONS, this.GenerateSkipMenu()] };
                        this.controlpanel.edit(this.controlpanelcontext);
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // Event Handlers
    Instance.prototype.DisconnectHandler = function () {
        try {
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Signalling, 5000);
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Connecting, 5000);
        }
        catch (e) {
            console.log("".concat(Utils.GetTimeStamp(), " ").concat(e));
            this.Stop();
        }
    };
    Instance.prototype.PlayerIdlingHandler = function () {
        if (this.tracklist.length < 1)
            console.log("".concat(Utils.GetTimeStamp(), " Finished streaming to ").concat(this.voicechannel.guild.name, "->").concat(this.voicechannel.name));
        else {
            if (!this.loop)
                this.NextTrack();
            this.Play();
        }
    };
    Instance.prototype.PlayerErrorHandler = function (error) {
        console.log("".concat(Utils.GetTimeStamp(), " Error: ").concat(error.message, " with resource ").concat(error.resource.metadata.title));
        this.Stop();
    };
    Instance.prototype.ControlsHandler = function (i) {
        try {
            switch (i.customId) {
                case "play":
                    this.UnPause();
                    break;
                case "pause":
                    this.Pause();
                    break;
                case "skip":
                    this.NextTrack();
                    break;
                case "enable-loop":
                case "disable-loop":
                    this.ToggleLoop();
                    break;
                case "stay-on-finish":
                    this.ToggleStayOnFinish();
                    break;
                case "disconnect":
                    this.Stop();
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
        i.deferUpdate();
    };
    return Instance;
}());
function Run(message, args, argswithcase, client) {
    return __awaiter(this, void 0, void 0, function () {
        var vc, g_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, message.member.voice.channel];
                case 1:
                    vc = _a.sent();
                    if (vc == null) {
                        message.channel.send("".concat(message.member.user, " vc?"));
                        return [2 /*return*/, true];
                    }
                    if (args.length < 1) {
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setDescription([
                                    "Usage: .play <string:url>",
                                    "",
                                    "Support List",
                                    "> Youtube Videos",
                                    "> Youtube Playlists",
                                    "> Spotify Tracks",
                                    "",
                                    "Youtube Video links can be chained"
                                ].join("\n"))
                            ]
                        });
                        return [2 /*return*/, true];
                    }
                    switch (args[0]) {
                        case "p":
                        case "play":
                            argswithcase.shift();
                            g_id = message.guild.id;
                            if (!instances.has(g_id))
                                instances.set(g_id, new Instance(vc, message.channel));
                            instances.get(g_id).BuildAndAddTracks(argswithcase.join(" "), message.member);
                            break;
                    }
                    if (message.deletable)
                        message.delete();
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.Run = Run;
exports.NSFW = false;
exports.title = "AudioPlayerTs";
exports.category = global.COMMAND_CATEGORIES.UTILITY.NAME;
exports.aliases = [
    ["p"],
    ["play"],
    ["next"],
    ["disconnect"],
    ["fuckoff"]
];
//# sourceMappingURL=AudioPlayer.js.map