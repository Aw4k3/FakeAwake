// @ts-check
const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core-discord");
const ytpl = require("ytpl");
const main_ytdl = require("ytdl-core");
const yt_search = require("yt-search");
const ytmpl = require("yt-mix-playlist");
const SpotifyWebApi = require("spotify-web-api-node");
const ParseSpotifyURI = require("spotify-uri");
const FileSystem = require("fs");
const request = require("request");
const Status = require("../../include/Status.js");
const Utils = require("../../include/Utils.js");

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

var instances = new Map();

const SECRETS = JSON.parse(FileSystem.readFileSync("./secrets/FakeAwake Secrets.json", "utf8"));
const SPOTIFY_API = new SpotifyWebApi();

/****** Initialise Spotify Tings ******/
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(SECRETS.Spotify.ClientID + ':' + SECRETS.Spotify.ClientSecret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        var token = body.access_token;
        SPOTIFY_API.setAccessToken(token);
    }
});
/****** Initialise Spotify Tings ******/

async function GetVoiceChannel(message) {
    return await message.member.voice.channel;
}

class Song {
    title = "";
    artist = "";
    length = 0;
    cover_url = "";
    platform = "";
    resolved = false;
    added_by = null;

    static PLATFORMS = {
        YOUTUBE: 0,
        SPOTIFY: 1
    };

    constructor(url) {

    }
}

class Instance {
    guild = null;
    voice_channel = null;
    connection = null; // DiscordVoice.joinVoiceChannel();
    audio_player = DiscordVoice.createAudioPlayer();
    video_queue = [];
    skip_menu_contents = [];
    queue_contents = [];
    is_playing = false;
    loop = false;
    spotify_warning = false;
    last_channel = null;
    control_panel_instance = null;
    interaction_collector = null;
    stay_on_finish = false;

    // ---------- Start of Panel Components ---------- //

    PLAY_BUTTON = new Discord.MessageButton()
        .setCustomId("play")
        .setLabel("Play")
        .setStyle("SUCCESS");

    PAUSE_BUTTON = new Discord.MessageButton()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle("PRIMARY");

    LOOP_ENABLED_BUTTON = new Discord.MessageButton()
        .setCustomId("disable-loop")
        .setLabel("Loop")
        .setStyle("SUCCESS");

    LOOP_DISABLED_BUTTON = new Discord.MessageButton()
        .setCustomId("enable-loop")
        .setLabel("Loop")
        .setStyle("SECONDARY");

    STAY_ENABLED_BUTTON = new Discord.MessageButton()
        .setCustomId("stay-on-finish")
        .setLabel("Stay on Finish")
        .setStyle("SUCCESS");

    STAY_DISABLED_BUTTON = new Discord.MessageButton()
        .setCustomId("stay-on-finish")
        .setLabel("Stay on Finish")
        .setStyle("SECONDARY");

    embed = new Discord.MessageEmbed()
        .setTitle("Audio Control Panel")
        .setDescription("<a:Loading:965027668280111255> Initialising...");

    CONTROLS = new Discord.MessageActionRow()
        .addComponents(
            this.PAUSE_BUTTON,
            new Discord.MessageButton()
                .setCustomId("skip")
                .setLabel("Skip")
                .setStyle("PRIMARY"),
            this.LOOP_DISABLED_BUTTON,
            new Discord.MessageButton()
                .setCustomId("clear")
                .setLabel("Clear Queue")
                .setStyle("DANGER")
                .setDisabled(true)
            
    );

    OPTIONS = new Discord.MessageActionRow()
        .addComponents(
            this.STAY_DISABLED_BUTTON,
            new Discord.MessageButton()
                .setCustomId("disconnect")
                .setLabel("Disconnect")
                .setStyle("DANGER")
        );

    SKIP_MENU = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId("skip-to")
                .setPlaceholder("Skip to...")
                .setOptions(this.skip_menu_contents)
        )

    CONTROL_PANEL = {
        embeds: [this.embed],
        components: [this.CONTROLS, this.OPTIONS]
    }

    // ---------- End of Panel Components ---------- //

    async Play(channel) {
        this.last_channel = channel;
        if (this.CONTROL_PANEL.components == []) this.CONTROL_PANEL.components = [this.CONTROLS, this.OPTIONS];
        if (this.video_queue.length > 0 && !this.is_playing) {
            this.is_playing = true;

            var stream = await ytdl(this.video_queue[0], { highWaterMark: (1 << 25) * 2 });

            this.connection.subscribe(this.audio_player);
            console.log(`${Utils.GetTimeStamp()} Connection subscribed to audio player for "${channel.guild.name}"`);
            var audio_resource = DiscordVoice.createAudioResource(stream, { inputType: DiscordVoice.StreamType.Opus });
            console.log(`${Utils.GetTimeStamp()} Audio stream assigned`);
            this.audio_player.play(audio_resource);
            console.log(`${Utils.GetTimeStamp()} Playing audio stream to "${channel.guild.name}"`);
        }

        this.SendControlPanel(channel, false, true);
    }

    Resume() {
        this.is_playing = true;
        this.CONTROLS.components[0] = this.PAUSE_BUTTON;
        this.embed.setColor(Status.StatusColor("OK"));

        this.audio_player.unpause();
        this.SendControlPanel(this.last_channel);
    }

    Pause() {
        this.is_playing = false;
        this.CONTROLS.components[0] = this.PLAY_BUTTON;
        this.embed.setColor("#000000");

        this.audio_player.pause();
        this.SendControlPanel(this.last_channel, false, false);
    }

    Skip(count = 1) {
        this.video_queue.splice(0, count);
        this.is_playing = false;

        if (this.video_queue.length > 0) this.Play(this.last_channel);
        else this.Stop(this.guild.id);
    }

    Stop(guild_id) {
        this.is_playing = false;
        this.video_queue = [];
        this.CONTROL_PANEL.components = [];

        if (this.stay_on_finish) {
            this.embed.setDescription("My work here is done but I've been told to be a good boi and stay UwU :3");
            this.control_panel_instance.edit(this.CONTROL_PANEL);
        } else {
            this.connection.disconnect();
            this.connection.destroy();
            this.embed.setDescription("My work here is done");
            this.control_panel_instance.edit(this.CONTROL_PANEL);
            Instance.RemoveInstance(guild_id);
        }
    }

    ToggleLoop() {
        this.loop = !this.loop;

        if (this.loop) {
            this.stay_on_finish = false;
            this.CONTROLS.components[2] = this.LOOP_ENABLED_BUTTON;

            this.embed.setFooter("When loop is enabled, Stay in VC is disable because just FakeAwake things x.x");
        } else {
            this.CONTROLS.components[2] = this.LOOP_DISABLED_BUTTON;

            this.embed.setFooter("Loop was turned off, Stay in VC can be used again");
        }

        this.SendControlPanel(this.last_channel);
    }

    ToggleStayOnFinish() {
        this.stay_on_finish = !this.stay_on_finish;
        if (this.loop) { this.stay_on_finish = false; }

        if (this.stay_on_finish) this.OPTIONS.components[0] = this.STAY_ENABLED_BUTTON;
        else this.OPTIONS.components[0] = this.STAY_DISABLED_BUTTON;

        this.SendControlPanel(this.last_channel, false, false);
    }

    async AddToQueue(args = [], autoplay = false) {
        // If args contains URL
        if (/(http:\/\/)|(https:\/\/)/gi.test(args.join(" "))) {
            for (var url of args) {
                // Is YouTube URL
                if (main_ytdl.validateURL(url)) {
                    // Is YouTube video URL?
                    if (!url.includes("list")) {
                        this.video_queue.push(url);
                        if (autoplay) this.Play(this.last_channel); else this.SendControlPanel(this.last_channel, false, true);
                    }

                    // Is YouTube Playlist?
                    else if (url.includes("list")) {
                        var playlist = await ytpl(url, { limit: Infinity })
                        for (var video of playlist.items) this.video_queue.push(video.url);
                        if (autoplay) this.Play(this.last_channel); else this.SendControlPanel(this.last_channel, false, true);
                    }
                }

                // Is Spotify URL?
                else if (url.includes("spotify")) {
                    var spotify_parsed = ParseSpotifyURI.parse(url);
                    switch (spotify_parsed.type) {
                        // Is Spotify Track
                        case "track":
                            var resolved = await (await SPOTIFY_API.getTrack(spotify_parsed.id)).body;
                            this.video_queue.push(await (await yt_search(`${resolved.artists[0].name} ${resolved.name}`)).videos[0].url);
                            if (autoplay) this.Play(this.last_channel); else this.SendControlPanel(this.last_channel, false, true);
                            break;

                        case "playlist":
                            var tracks = await (await SPOTIFY_API.getPlaylistTracks(spotify_parsed.id)).body.items;
                            for (var item of tracks) {
                                this.video_queue.push(await (await yt_search(`${item.track.artists[0].name} ${item.track.name}`)).videos[0].url);
                                if (autoplay) this.Play(this.last_channel); else this.SendControlPanel(this.last_channel, false, true);
                            }
                            break;
                    }
                }
            }
        } else {
            this.video_queue.push(await (await yt_search(args.join(" "))).videos[0].url);
            if (autoplay) this.Play(this.last_channel); else this.SendControlPanel(this.last_channel, false, true);
        }
    }

    Clear() {
        this.video_queue = [];
        this.SendControlPanel(this.last_channel, false, true);
    }

    async ReloadQueue(quiet_resolve = false) {
        // Generate Queue
        if (this.video_queue.length < 1) {
            this.embed.setDescription([
                "Usage: .play <string:url>",
                "",
                "Support List",
                "> Youtube Videos",
                "> Youtube Playlists",
                "> Spotify Tracks",
                "",
                "Youtube Video links can be chained"
            ].join("\n"));

            this.CONTROL_PANEL = {
                embeds: [this.embed],
                components: []
            }

            this.SendControlPanel(this.last_channel);
            return;
        }

        this.CONTROL_PANEL = {
            embeds: [this.embed],
            components: [this.CONTROLS, this.OPTIONS]
        }

        if (quiet_resolve) this.embed.setFooter("Resolving Queue..."); else this.queue_contents = [`<a:Loading:965027668280111255> Resolving Queue...`];
        this.embed.setDescription(this.queue_contents.join("\n"))
            .setColor("#2c1852");
        this.control_panel_instance.edit(this.CONTROL_PANEL);
        this.skip_menu_contents = [];
        if (this.spotify_warning) this.queue_contents.push(":warning: Spotify tracks are converted to youtube tracks due to how the platform works, there is a super low chance the wrong song is added to the queue. (Other bots dont tell you this)");

        var current_song_info = await main_ytdl.getBasicInfo(this.video_queue[0]);

        this.queue_contents.push([
            `**Currently Playing**`,
            `> [${current_song_info.videoDetails.title}](${this.video_queue[0]})`,
            `> [${current_song_info.videoDetails.ownerChannelName}](${current_song_info.videoDetails.ownerProfileUrl})`,
            `> ${current_song_info.videoDetails.lengthSeconds.toHHMMSS()}`,
            ""
        ].join("\n"));

        if (this.video_queue.length == 1) this.queue_contents[0] = `<:GreenTick:908774720630046772> Resolved Queue (${this.video_queue.length} songs)`;

        if (this.video_queue[1]) {
            var next_song_info = await main_ytdl.getBasicInfo(this.video_queue[1]);
            this.queue_contents.push([
                `**Next**`,
                `> [${next_song_info.videoDetails.title}](${this.video_queue[1]})`,
                `> [${next_song_info.videoDetails.ownerChannelName}](${next_song_info.videoDetails.ownerProfileUrl})`,
                `> ${next_song_info.videoDetails.lengthSeconds.toHHMMSS()}`,
                ""
            ].join("\n"));

            // Dupe checking becuase idk how it even manages double half the inputs to the array
            if (this.skip_menu_contents.length < 1) {
                this.skip_menu_contents.push({
                    label: next_song_info.videoDetails.title,
                    value: "1"
                });
            }

            if (this.video_queue.length == 2) this.queue_contents[0] = `<:GreenTick:908774720630046772> Resolved Queue (${this.video_queue.length} songs)`;
        }

        if (this.video_queue.length > 2) {
            this.queue_contents.push("**Rest of queue** (Up to 15 tracks will be displayed at a time)");
            for (var i = 2; i < this.video_queue.length; i++) {
                if (this.queue_contents.length < 19) {
                    var song_info = await main_ytdl.getBasicInfo(this.video_queue[i]);
                    this.queue_contents.push(`[${song_info.videoDetails.title}](${this.video_queue[i]}) (${song_info.videoDetails.lengthSeconds.toHHMMSS()})`);

                    // Dupe checking becuase idk how it even manages double half the inputs to the array
                    if (this.skip_menu_contents[this.skip_menu_contents.length - 1].value != i) {
                        this.skip_menu_contents.push({
                            label: song_info.videoDetails.title,
                            value: i.toString()
                        });
                    }
                    
                }

                if (i + 1 == 17 || i + 1 == this.video_queue.length) {
                    this.queue_contents[0] = `<:GreenTick:908774720630046772> Resolved Queue (${this.video_queue.length} songs)`;
                    break;
                }
            }
        }

        if (this.skip_menu_contents.length > 0) {
            this.CONTROL_PANEL.components = [this.CONTROLS, this.OPTIONS, this.SKIP_MENU];

            this.SKIP_MENU.components[0].setOptions(this.skip_menu_contents);
        }
        else this.CONTROL_PANEL.components = [this.CONTROLS, this.OPTIONS];

        this.embed.setDescription(this.queue_contents.join("\n"))
            .setThumbnail(current_song_info.videoDetails.thumbnails[0].url.split("?")[0])
            .setColor(Status.StatusColor("OK"));
    }

    async SendControlPanel(channel, instantiate = false, reload_queue = false) {
        if (this.control_panel_instance == null) instantiate = true;

        if (instantiate) this.control_panel_instance = await channel.send(this.CONTROL_PANEL);
        else this.control_panel_instance.edit(this.CONTROL_PANEL);

        if (reload_queue) {
            await this.ReloadQueue();
            this.control_panel_instance.edit(this.CONTROL_PANEL);
        }

        var filter = (x) => { return true; }
        if (this.CONTROL_PANEL.components != []) this.interaction_collector = this.control_panel_instance.createMessageComponentCollector({ filter, max: 1 });

        this.interaction_collector.on("collect", i => {
            switch (i.customId) {
                case "play":
                    this.Resume();
                    break;

                case "pause":
                    this.Pause();
                    break;

                case "skip":
                    this.Skip();
                    break;

                case "enable-loop":
                case "disable-loop":
                    this.ToggleLoop();
                    break;

                case "clear":
                    this.Clear();
                    break;

                case "stay-on-finish":
                    this.ToggleStayOnFinish();
                    break;

                case "disconnect":
                    this.Stop();
                    break;

                case "skip-to":
                    console.log(parseInt(i.values[0]));
                    this.Skip(parseInt(i.values[0]))
                    break;
            }

            // i.update(this.CONTROL_PANEL);
            i.deferUpdate();
        });
    }

    static RemoveInstance(guild_id) {
        instances.delete(guild_id);
    }

    static TryFetchInstance(guild_id) {
        if (instances.has(guild_id)) return instances.get(guild_id);
        return false;
    }

    constructor(message) {
        console.log(`${Utils.GetTimeStamp()} Creating audio player instance for "${message.guild.name}"`);
        console.log(`${Utils.GetTimeStamp()} Fetching voice channel`);
        this.guild = message.guild;
        this.last_channel = message.channel;
        this.voice_channel = GetVoiceChannel(message).then((voice_channel) => {
            console.log(`${Utils.GetTimeStamp()} Successfully fetched voice channel`);
            this.connection = DiscordVoice.joinVoiceChannel({
                channelId: voice_channel.id,
                guildId: voice_channel.guild.id,
                adapterCreator: voice_channel.guild.voiceAdapterCreator
            });

            this.connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, () => {
                try {
                    DiscordVoice.enterState(this.connection, DiscordVoice.VoiceConnectionStatus.Signalling, 5000);
                    DiscordVoice.enterState(this.connection, DiscordVoice.VoiceConnectionStatus.Connecting, 5000);
                } catch (e) {
                    console.log(`${Utils.GetTimeStamp()} ${e}`);
                    this.Stop();
                }
            });

            console.log(`${Utils.GetTimeStamp()} Successfully connected to voice channel`);
        });

        this.audio_player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            console.log(`${Utils.GetTimeStamp()} ${this.video_queue[0]} has finished playing!`);
            if (!this.loop) this.Skip();
            else {
                this.is_playing = false;
                this.Play(this.last_channel);
            }
        });

        this.audio_player.on(DiscordVoice.AudioPlayerStatus.Buffering, () => {
            console.log(`${Utils.GetTimeStamp()} Audio player: Buffering`);
        });

        this.audio_player.on("error", error => {
            console.log(`${Utils.GetTimeStamp()} Error: ${error.message} with resource ${error.resource.metadata.title}`);
            this.Stop();
        });
    }
}

async function Run(message, args, args_with_case, client) {
    if (await GetVoiceChannel(message) == null) {
        message.channel.send("VC?");
        return;
    }

    switch (args[0]) {
        case "playx":
            if (args_with_case.length < 2) {
                message.channel.send("A url or something for me to search to play would be nice >:)");
                return;
            }

            args_with_case.shift();
            var messsage = await message.channel.send("Initialising...");

            // Find instance and play audio
            var g_id = message.guild.id;
            var instance = Instance.TryFetchInstance(g_id);
            if (!instance) {
                instances.set(g_id, new Instance(message));
                instances.get(g_id).AddToQueue(args_with_case, true);
            } else {
                instance.AddToQueue(args_with_case);
            }

            message.delete();
            messsage.delete();
            break;

        case "mix":
            if (args_with_case.length < 2) {
                message.channel.send("A url or something for me to search to play would be nice");
                return;
            }

            var messsage = await message.channel.send("Initialising...");

            var urls = [];

            if (main_ytdl.validateURL(args_with_case[1])) {
                var mix = await ytmpl(main_ytdl.getVideoID(args_with_case[1])).catch(e => console.log(e));
                for (var item of mix.items) urls.push(item.url);
            }

            message.delete();

            // Find instance and play audio
            var g_id = message.guild.id;
            var instance = Instance.TryFetchInstance()
            if (!instance) {
                instances.set(g_id, new Instance(message));
                instances.get(g_id).AddToQueue(args_with_case, true);
            } else {
                instance.AddToQueue(args_with_case);
            }

            messsage.delete();
            break;

        default:
            var instance = Instance.TryFetchInstance(message.guild.id);
            if (instance instanceof Instance) {
                instance.SendControlPanel(message.channel, true, true);
            } else {
                // instances.push(new Instance(message));
                // instances[instances.length - 1].ReloadQueue();
                // instances[instances.length - 1].SendControlPanel(message.channel);
            }
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "AudioPlayerJs",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        // ["controlpanel"],
        // ["play"],
        // ["mix"],
        // ["skip"],
        // ["next"],
        // ["clear"],
        // ["dc"],
        // ["disconnect"],
        // ["fuckoff"],
        // ["leave"],
        // ["stop"],
        // ["yeet"],
        // ["queue"],
        // ["songlist"],
        // ["nowplaying"],
        // ["playing"],
        // ["currentsong"],
        // ["current"]
    ],
    Run
}