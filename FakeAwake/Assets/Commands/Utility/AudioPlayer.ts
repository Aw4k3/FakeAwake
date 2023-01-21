import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as Ytdl from "ytdl-core-discord";
import * as YtdlCore from "ytdl-core";
import * as YtPlaylist from "ytpl";
import * as YtSearch from "yt-search";
import * as SpotifyWebApi from "spotify-web-api-node";
import * as SpotifyUri from "spotify-uri";
import * as FileSystem from "fs";
import * as Request from "request";
import * as Status from "../../include/Status.js";
import * as Utils from "../../include/Utils.js";

const SECRETS = JSON.parse(FileSystem.readFileSync("./secrets/FakeAwake Secrets.json", "utf8"));
// const SPOTIFY_API: SpotifyWebApi = new SpotifyWebApi();

var instances: Map<string, Instance> = new Map();

enum PLATFORMS {
    UNSPECIFIED = -1,
    YOUTUBE,
    SPOTIFY
};

enum PLAYER_STATE {
    INITIALISING,
    PLAYING,
    PAUSED,
    IDLE
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
const PLAY_BUTTON = new Discord.MessageButton()
    .setCustomId("play")
    .setLabel("Play")
    .setStyle("SUCCESS");

const PAUSE_BUTTON = new Discord.MessageButton()
    .setCustomId("pause")
    .setLabel("Pause")
    .setStyle("PRIMARY");

const SKIP_BUTTON = new Discord.MessageButton()
    .setCustomId("skip")
    .setLabel("Skip")
    .setStyle("PRIMARY")

const LOOP_ENABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("disable-loop")
    .setLabel("Loop")
    .setStyle("SUCCESS");

const LOOP_DISABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("enable-loop")
    .setLabel("Loop")
    .setStyle("SECONDARY");

const STAY_ENABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("stay-on-finish")
    .setLabel("Stay on Finish")
    .setStyle("SUCCESS");

const STAY_DISABLED_BUTTON = new Discord.MessageButton()
    .setCustomId("stay-on-finish")
    .setLabel("Stay on Finish")
    .setStyle("SECONDARY");

const CLEAR_QUEUE_BUTTON = new Discord.MessageButton()
    .setCustomId("clear")
    .setLabel("Clear Queue")
    .setStyle("DANGER")
    .setDisabled(true);

const DISCONNECT_BUTTON = new Discord.MessageButton()
    .setCustomId("disconnect")
    .setLabel("Disconnect")
    .setStyle("DANGER");

/*********** CLASSES ***********/

class Track {
    url: string = "Unresolved";
    cover_url: string = "Unresolved";
    title: string = "Unresolved";
    artistname: string = "Unresolved";
    artisturl: string = "Unresolved"
    length: number = 0;
    platform: PLATFORMS;
    resolved: boolean = false;
    added_by: Discord.GuildMember;

    constructor(url: string, platform: PLATFORMS, user: Discord.GuildMember) {
        this.url = url;
        this.platform = platform;
        this.added_by = user;

        switch (this.platform) {
            case PLATFORMS.YOUTUBE:
                this.ResolveYouTube();
                break;
        }
    }

    async ResolveYouTube() {
        var info: YtdlCore.videoInfo = await YtdlCore.getBasicInfo(this.url);
        this.cover_url = info.thumbnail_url;
        this.title = info.videoDetails.title;
        this.artistname = info.videoDetails.ownerChannelName;
        this.artisturl = info.videoDetails.ownerProfileUrl;
        this.length = parseInt(info.videoDetails.lengthSeconds, 10);
        this.resolved = true;
    }

    GetEmbedText(): string {
        return [
            `> [${this.title}](${this.url})`,
            `> [${this.artistname}](${this.artisturl})`,
            `> ${FormatTime(this.length)}`
        ].join("\n");
    }

    GetBasicEmbedText(): string {
        return `[${this.title}](${this.url}) (${FormatTime(this.length)})`;
    }
}

class Instance {
    voicechannel: Discord.VoiceBasedChannel;
    connection: DiscordVoice.VoiceConnection;
    audioplayer: DiscordVoice.AudioPlayer = new DiscordVoice.AudioPlayer();
    tracklist: Track[] = [];
    playerstate: PLAYER_STATE = PLAYER_STATE.INITIALISING;
    loop: boolean = false;
    textchannel: Discord.TextBasedChannel;
    controlpanel: Discord.Message;
    controlpanelcontext = { embeds: [], components: [] };
    controlpanelembed: Discord.MessageEmbed = new Discord.MessageEmbed();
    stayonfinish: boolean = false;
    interactioncollector: Discord.InteractionCollector<any> = null;
    static queuedisplaysize: number = 14;

    CONTROLS = new Discord.MessageActionRow()
        .addComponents(PAUSE_BUTTON, SKIP_BUTTON, LOOP_DISABLED_BUTTON, CLEAR_QUEUE_BUTTON);

    OPTIONS = new Discord.MessageActionRow()
        .addComponents(STAY_DISABLED_BUTTON, DISCONNECT_BUTTON);
        
    constructor(vc: Discord.VoiceBasedChannel, tc: Discord.TextBasedChannel) {
        this.textchannel = tc;
        this.voicechannel = vc;

        // Connect to vc
        console.log(`${Utils.GetTimeStamp()} Creating audio player instance for "${vc.guild.name}"`);

        // Error Checking
        if (this.voicechannel == null) return;
        if (!vc.joinable) {
            this.textchannel.send("Unable to join vc :(");
            return;
        }

        // Join VC
        this.connection = DiscordVoice.joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator as unknown as DiscordVoice.DiscordGatewayAdapterCreator
        });
        this.connection.subscribe(this.audioplayer);

        console.log(`${Utils.GetTimeStamp()} Successfully connected to voice channel at ${vc.guild.name}.${vc.name}`);

        // Event Handlers
        this.connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, this.DisconnectHandler.bind(this));
        this.audioplayer.on(DiscordVoice.AudioPlayerStatus.Idle, this.PlayerIdlingHandler.bind(this));
        this.audioplayer.on("error", this.PlayerErrorHandler.bind(this));

        // Setup control panel
        this.controlpanelembed = new Discord.MessageEmbed()
            .setTitle("Audio Control Panel")
            .setDescription("<a:Loading:965027668280111255> Initialising...")
            .setColor(Status.StatusColor("OK"));

        this.controlpanelcontext = { embeds: [this.controlpanelembed], components: [this.CONTROLS, this.OPTIONS] };
        this.SendControlPanel();
    }

    GenerateSkipMenu(): Discord.MessageActionRow {
        var options = new Discord.MessageSelectMenu()
            .setCustomId("skip-to")
            .setPlaceholder("Skip to...");
        var menu = new Discord.MessageActionRow()
            .addComponents(options);

        for (var i = 1; i < Instance.queuedisplaysize + 1; i++) {
            if (!this.tracklist[i]) break;

            options.addOptions({
                label: `${i + 1}. ${this.tracklist[i].title}`,
                value: i.toString()
            });
        }

        return menu;
    }

    async BuildAndAddTracks(context: string, user: Discord.GuildMember): Promise<void> {
        if (/(http:\/\/)|(https:\/\/)/gi.test(context)) { // If Url
            if (YtdlCore.validateURL(context) || YtPlaylist.validateID(context)) { // Parse YouTube Url
                if (context.includes("list")) { // Resolve Playlist
                    var playlist: YtPlaylist.Result = await YtPlaylist.default(await YtPlaylist.getPlaylistID(context), { limit: Infinity });
                    for (var v of playlist.items) this.tracklist.push(new Track(v.url, PLATFORMS.YOUTUBE, user));
                } else {
                    this.tracklist.push(new Track(context, PLATFORMS.YOUTUBE, user));
                }
            }
        } else { // Search on YouTube
            var result: YtSearch.SearchResult = await YtSearch.search(context);
            var url: string = result.videos[0].url;
            this.tracklist.push(new Track(url, PLATFORMS.YOUTUBE, user));
        }

        if (this.playerstate == PLAYER_STATE.IDLE || this.playerstate == PLAYER_STATE.INITIALISING) this.Play();
        else this.SendControlPanel();
    }

    // Control Functions
    async Play(): Promise<void> {
        // Error Checking
        if (this.voicechannel == null) return;
        if (!this.voicechannel.joinable) {
            this.textchannel.send("Unable to join vc :(");
            return;
        }

        if (this.playerstate == PLAYER_STATE.IDLE) return;
        this.playerstate = PLAYER_STATE.PLAYING;

        // Stream Audio
        var audiostream = await Ytdl.default(this.tracklist[0].url, { highWaterMark: (1 << 25) * 2 });
        var audioresource = DiscordVoice.createAudioResource(audiostream, { inputType: DiscordVoice.StreamType.Opus });
        this.audioplayer.play(audioresource);

        console.log(`${Utils.GetTimeStamp()} Play audio to ${this.voicechannel.guild.name}->${this.voicechannel.name}`);

        this.SendControlPanel();        
    }

    Pause(): void {
        if (this.playerstate == PLAYER_STATE.PAUSED) return;
        this.audioplayer.pause();
        this.controlpanelembed.setColor("#000000");
        this.CONTROLS.components[0] = PLAY_BUTTON;
        this.playerstate = PLAYER_STATE.PAUSED;
        this.ReloadButtons()
    }

    UnPause(): void {
        if (this.playerstate == PLAYER_STATE.PLAYING) return;
        this.audioplayer.unpause();
        this.controlpanelembed.setColor(Status.StatusColor("OK"));
        this.CONTROLS.components[0] = PAUSE_BUTTON;
        this.playerstate = PLAYER_STATE.PLAYING;
        this.ReloadButtons()
    }

    async Stop(): Promise<void> {
        this.audioplayer.stop();
        this.connection.disconnect();
        this.connection.destroy();
        delete this.tracklist;

        this.audioplayer.removeAllListeners();
        this.connection.removeAllListeners();
        this.interactioncollector.removeAllListeners();

        this.controlpanelembed.setDescription("Done innit");
        this.controlpanelcontext.components = [];

        if (this.controlpanel == null) this.controlpanel = await this.textchannel.send(this.controlpanelcontext);
        else this.controlpanel.edit(this.controlpanelcontext);
        Instance.DestroyInstance(this.voicechannel.guild.id);
    }

    static DestroyInstance(g_id: string) {
        instances.delete(g_id);
    }

    NextTrack(count: number = 1): void {
        if (count < 1 || count > this.tracklist.length) return;
        this.tracklist.splice(0, count);
        if (this.tracklist.length > 0) this.Play(); else this.Stop();
    }

    ToggleLoop(): void {
        if (this.loop) {
            this.loop = false;
            this.CONTROLS.components[2] = LOOP_DISABLED_BUTTON;
        } else {
            this.loop = true;
            this.CONTROLS.components[2] = LOOP_ENABLED_BUTTON;
        }

        this.ReloadButtons()
    }

    ToggleStayOnFinish(): void {
        if (this.stayonfinish) {
            this.stayonfinish = false;
            this.OPTIONS.components[0] = STAY_DISABLED_BUTTON;
        } else {
            this.stayonfinish = true;
            this.OPTIONS.components[0] = STAY_ENABLED_BUTTON;
        }

        this.ReloadButtons()
    }

    async SendControlPanel(): Promise<void> {
        // Resolve Control Panel
        var result: string[] = [];

        // Send Control Panel
        if (this.controlpanel == null) this.controlpanel = await this.textchannel.send(this.controlpanelcontext);

        this.interactioncollector = this.controlpanel.createMessageComponentCollector({ max: 1 });
        this.interactioncollector.once("collect", this.ControlsHandler.bind(this));

        if (this.tracklist.length < 1) {
            result.push(`Queue Empty`);
            this.controlpanelembed.setDescription(result.join("\n"));
            this.controlpanel.edit(this.controlpanelcontext);
        } else {
            result.push(`<a:Loading:965027668280111255> Resolving Queue...`);
            this.controlpanelembed.setDescription(result.join("\n"));
            this.controlpanel.edit(this.controlpanelcontext);
            this.controlpanelcontext = { embeds: [this.controlpanelembed], components: [this.CONTROLS, this.OPTIONS] };
            for (var i = 0; i < this.tracklist.length; i++) {
                if (i > Instance.queuedisplaysize) break;
                if (!this.tracklist[i].resolved) await this.tracklist[i].ResolveYouTube();
                switch (i) {
                    case 0:
                        result.push(`**Currently Playing**`);
                        result.push(this.tracklist[i].GetEmbedText());
                        this.controlpanelembed.setThumbnail(this.tracklist[i].cover_url);
                        this.controlpanelembed.setFooter({ text: `This track was added by: ${this.tracklist[i].added_by.nickname}`, iconURL: this.tracklist[i].added_by.avatarURL() });
                        break;

                    case 1:
                        result.push(`**Next Up**`);
                        result.push(this.tracklist[i].GetEmbedText());
                        break;

                    default:
                        result.push(`**${i + 1}.** ${this.tracklist[i].GetBasicEmbedText()}`);
                        break;
                }

                if (i == this.tracklist.length - 1) break;
            }

            result.shift(); // Remove "resolving" header
            this.controlpanelembed.setDescription(result.join("\n"));
            if (this.tracklist.length > 2) this.controlpanelcontext = { embeds: [this.controlpanelembed], components: [this.CONTROLS, this.OPTIONS, this.GenerateSkipMenu()] };
            this.controlpanel.edit(this.controlpanelcontext);
        }
    }

    async ReloadButtons(): Promise<void> {
        this.interactioncollector = this.controlpanel.createMessageComponentCollector({ max: 1 });
        this.interactioncollector.once("collect", this.ControlsHandler.bind(this));
        this.controlpanel.edit(this.controlpanelcontext);
    }

    // Event Handlers
    DisconnectHandler(): void {
        try {
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Signalling, 5000);
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Connecting, 5000);
        } catch (e) {
            console.log(`${Utils.GetTimeStamp()} ${e}`);
            this.Stop();
        }
    }

    PlayerIdlingHandler(): void {
        this.playerstate = PLAYER_STATE.IDLE;
        if (this.tracklist.length < 1) {
            console.log(`${Utils.GetTimeStamp()} Finished streaming to ${this.voicechannel.guild.name}->${this.voicechannel.name}`);
        } else {
            if (!this.loop) this.NextTrack();
            this.Play()
        }
    }

    PlayerErrorHandler(error): void {
        console.log(`${Utils.GetTimeStamp()} Error: ${error.message} with resource ${error.resource.metadata.title}`);
        this.Stop();
    }

    ControlsHandler(i): void {
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

            case "skip-to":
                this.NextTrack(parseInt(i.values[0], 10));
                break;
        }

        i.deferUpdate();
    }
}

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {
    if (args.length < 1) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription([
                        "Usage: .play <string:url>",
                        "",
                        "Support List",
                        "> Youtube Videos",
                        "> Youtube Playlists"
                    ].join("\n"))
            ]
        });
        return true;
    }

    var vc = await message.member.voice.channel;
    if (vc == null) {
        message.channel.send(`${message.member.user} vc?`);
        return true;
    }

    switch (args[0]) {
        case "p":
        case "play":
            argswithcase.shift();

            var g_id: string = message.guild.id;
            if (!instances.has(g_id)) instances.set(g_id, new Instance(vc, message.channel));
            instances.get(g_id).BuildAndAddTracks(argswithcase.join(" "), message.member);
            break;
    }

    if (message.deletable) message.delete();

    return true;
}

export const NSFW: boolean = false;
export const title: string = "AudioPlayerTs";
export const category: string = global.COMMAND_CATEGORIES.UTILITY.NAME;
export const aliases: string[][] = [
    ["p"],
    ["play"],
    ["next"],
    ["disconnect"],
    ["fuckoff"]
];