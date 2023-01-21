const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice");
const FileSystem = require("fs");
const Chroma = require("chroma-js");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const GuildSettings = require("../../include/GuildSettings.js");
const WebClient = require("../../include/WebClient.js");
const Status = require("../../include/Status.js");

var YT_DOWNLOADER_CLIENT = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg",                 // FFmpeg binary location
    "outputPath": "./Assets/Audio",         // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

class Soundboard {
    auto_leave = true;
    guild_id = null;
    voice_connection = null;
    client = null;
    loop = false;
    selected_soundfile = "";
    sounds = [[]];
    sound_selector_dropdowns = [];
    soundset_selector_dropdown = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId("soundset-selector")
                .setPlaceholder("Switch sound sets")
    );

    connection_options = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId("join_vc")
                .setLabel("Join VC")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("leave_vc")
                .setLabel("Leave VC")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("vc_toggle")
                .setLabel("Stay in VC")
                .setStyle("PRIMARY")
        );

    player_controls = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId("play")
                .setLabel("Play")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("stop")
                .setLabel("Stop")
                .setStyle("PRIMARY")
                .setDisabled(true),
            new Discord.MessageButton()
                .setCustomId("loop")
                .setLabel("Loop")
                .setStyle("PRIMARY")
                .setDisabled(true),
            new Discord.MessageButton()
                .setCustomId("delete")
                .setLabel("Delete")
                .setStyle("DANGER")
        );

    ToggleAutoLeave() {
        if (this.auto_leave) {
            this.auto_leave = false;

            this.connection_options.components[2] = new Discord.MessageButton()
                .setCustomId("vc_toggle")
                .setLabel("Auto leave VC")
                .setStyle("PRIMARY");
        } else {
            this.auto_leave = true;

            this.connection_options.components[2] = new Discord.MessageButton()
                .setCustomId("vc_toggle")
                .setLabel("Stay in VC")
                .setStyle("PRIMARY");
        }
        
    }

    async JoinVC(member) {
        var voice_channel = await member.voice.channel;

        if (voice_channel === null) return;

        this.voice_connection = DiscordVoice.joinVoiceChannel({
            channelId: voice_channel.id,
            guildId: voice_channel.guild.id,
            adapterCreator: voice_channel.guild.voiceAdapterCreator
        });
    }

    UpdateContext(soundset) {
        this.Reload(soundset);
        return { components: [this.soundset_selector_dropdown, this.sound_selector_dropdowns[soundset], this.player_controls, this.connection_options] };
    }

    SendControls(channel, soundset = 0) {
        channel.send({ components: [this.soundset_selector_dropdown, this.sound_selector_dropdowns[soundset], this.player_controls, this.connection_options] }).then(() => {
            this.client.on("interactionCreate", async interaction => {

                switch (interaction.customId) {
                    case "soundset-selector":
                        // Swap soundsets
                        for (var i = 0; i < this.soundset_selector_dropdown.components[0].options.length; i++) {
                            if (this.soundset_selector_dropdown.components[0].options[i].value === interaction.values[0]) {
                                interaction.update(this.UpdateContext(i));
                            }
                        }
                        break;

                    case "soundfile":
                        this.selected_soundfile = interaction.values[0];
                        interaction.deferUpdate();
                        break;

                    case "join_vc":
                        if (await interaction.member.voice.channel != null) {
                            await this.JoinVC(interaction.member);
                            interaction.update();
                        } else {
                            channel.send(`${interaction.user}, which one?`);
                            interaction.update();
                        }
                        break;

                    case "leave_vc":
                        if (this.voice_connection != null) {
                            this.voice_connection.destroy();
                            this.voice_connection = null;
                        }
                        break;

                    case "vc_toggle":
                        this.ToggleAutoLeave();
                        interaction.update({ components: [this.soundset_selector_dropdown, this.sound_selector_dropdowns[soundset], this.player_controls, this.connection_options] });
                        break;

                    case "play":
                        if (this.selected_soundfile === "") {
                            channel.send(`${interaction.user}, Why do you want me to play silence? *(Hint: Select a soundfile for me to play)*`);
                            interaction.update();
                        }

                        if (await interaction.member.voice.channel != null) {
                            await this.JoinVC(interaction.member);
                            this.Play(interaction.member);
                            interaction.update();
                        } else {
                            channel.send(`${interaction.user}, I can't bluetooth into your brain, do you want to VC instead?`);
                            interaction.update();
                        }
                        break;

                    case "stop":

                        break;

                    case "loop":

                        break;

                    case "delete":
                        await this.Delete(interaction.guild.id);
                        if (this.sounds = [[]]) GuildSettings.set_property(interaction.guild, GuildSettings.PROPERTIES.SOUNDBOARD, undefined);
                        else GuildSettings.set_property(interaction.guild, GuildSettings.PROPERTIES.SOUNDBOARD, this.sounds);
                        this.Reload();
                        interaction.update({ content: "Resummon the soundboard", components: [] });
                        channel.send(`\`${this.selected_soundfile}\` was deleted`);
                        break;
                }

                return true;
            });
        })
    }

    Reload(set_index = 0) {
        this.soundset_selector_dropdown.components[0] = new Discord.MessageSelectMenu()
            .setCustomId(`soundset-selector`)
            .setPlaceholder(`Set ${set_index + 1}`);

        var i = 0;
        for (var set of this.sounds) {
            this.soundset_selector_dropdown.components[0].addOptions(
                {
                    label: `Set ${i + 1}`,
                    value: `set-${i}`,
                    emoji: "635979662748549139"
                }
            );

            i++;

            var _sounds = [];
            for (var file of set) {
                _sounds.push({
                    label: file,
                    value: file,
                    emoji: "635979662748549139"
                })
            }

            this.sound_selector_dropdowns.push(
                new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId("soundfile")
                            .setPlaceholder("Select sound file")
                            .setOptions(_sounds)
                )
            );
        }
    }

    Play(member) {
        var audio_player = DiscordVoice.createAudioPlayer();
        var audio_resource = DiscordVoice.createAudioResource(`./Assets/Guild Assets/${member.guild.id}/${this.selected_soundfile}`);

        audio_player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            if (this.auto_leave) this.voice_connection.disconnect();
        });

        this.voice_connection.subscribe(audio_player);

        audio_player.play(audio_resource);
    }
    
    async Add(message, args) {
        if (message.attachments.size > 0) {
            for (var attachment of message.attachments.values())
                if (attachment.contentType.includes("audio")) {
                    await WebClient.DownloadFileAsync(attachment.url, `./Assets/Guild Assets/${message.guild.id}/${attachment.name}`);
                    for (var set of this.sounds)
                        if (set.length < 25) {
                            set.push(attachment.name);
                            break;
                        }

                    message.channel.send(`Added \`${attachment.name}\` to soundboard`);
                } else {
                    message.channel.send(`${message.author}, \`${attachment.name}\`'s content type isn't audio`)
                }

            GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.SOUNDBOARD, this.sounds);
        } else if (args[2]) {
            if (/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(args[2])) {
                var url = args[2];
                var video_id = args[2].split("?v=")[1];

                url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

                if (url[2] != undefined) {
                    video_id = url[2].split(/[^0-9a-z_\-]/i);
                    video_id = video_id[0];
                } else {
                    video_id = url;
                }

                YT_DOWNLOADER_CLIENT = new YoutubeMp3Downloader({
                    "ffmpegPath": "ffmpeg",                                // FFmpeg binary location
                    "outputPath": `./Assets/Guild Assets/${message.guild.id}`, // Output file location (default: the home directory)
                    "youtubeVideoQuality": "highestaudio",                 // Desired video quality (default: highestaudio)
                    "queueParallelism": 2,                                 // Download parallelism (default: 1)
                    "progressTimeout": 2000,                               // Interval in ms for the progress reports (default: 1000)
                    "allowWebm": false                                     // Enable download from WebM sources (default: false)
                });

                var ProgressEmbed = new Discord.MessageEmbed()
                    .setTitle("Soundboard")
                    .setColor(Chroma(0, 0, 0).hex("rgb"))
                    .setDescription(`**Downloading Audio**\nProgress: 0%`)
                    .setFooter("Adding new sound");

                message.channel.send({ embeds: [ProgressEmbed] }).then(message => {
                    var name = "";
                    if (args[3]) {
                        name = args.slice(3, args.length).join(" ");
                        YT_DOWNLOADER_CLIENT.download(video_id, `${name}.mp3`);
                    } else {
                        YT_DOWNLOADER_CLIENT.download(video_id);
                    }

                    YT_DOWNLOADER_CLIENT.on("progress", progress => {
                        ProgressEmbed.setDescription([
                            `**Downloading Audio**`,
                            `Progress: ${Math.round(progress["progress"]["percentage"])}%`,
                            `${Math.round(progress["progress"]["transferred"] / 1024 / 1024 * 100) / 100}/${Math.round(progress["progress"]["length"] / 1024 / 1024 * 100) / 100}MB`
                        ].join("\n"))
                            .setColor(Chroma(0, Math.round((progress["progress"]["percentage"] / 100) * 255), 0, "rgb").hex("rgb"))
                        message.edit({ embeds: [ProgressEmbed] });
                    });

                    YT_DOWNLOADER_CLIENT.on("finished", (error, data) => {
                        console.log(data);
                        console.log(error);

                        ProgressEmbed = new Discord.MessageEmbed()
                            .setTitle("Soundboard")
                            .setColor(Status.StatusColor("OK"))
                            .setDescription(`${message.author} added **"${data["videoTitle"]}"**`)
                            .setFooter("Re-summon the soundboard using .soundboard");

                        message.edit({ embeds: [ProgressEmbed] });

                        for (var set of this.sounds)
                            if (set.length < 25) {
                                if (args[3]) set.push(`${name}.mp3`);
                                else set.push(`${data["videoTitle"]}.mp3`);
                                GuildSettings.set_property(message.guild, GuildSettings.PROPERTIES.SOUNDBOARD, this.sounds);
                                break;
                            }
                    });

                    YT_DOWNLOADER_CLIENT.on("error", (error, data) => {
                        console.log(data);
                        console.log(error);

                        ProgressEmbed = new Discord.MessageEmbed()
                            .setTitle("Soundboard")
                            .setColor(Chroma(0, 255, 0, "rgb").hex("rgb"))
                            .setDescription(`Failed to add **"${data["videoTitle"]}"**\n${error}`)
                            .setFooter(":NotLikeThis:");

                        message.edit({ embeds: [ProgressEmbed] });
                    });
                });

                
            } else {
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Soundboard")
                            .setColor(Status.StatusColor("ERROR"))
                            .setDescription([
                                `Invalid audio file or youtube URL`,
                                `soundboard add \`<attachment:file|string:youtube url>\` \`[string:name]\``
                            ].join("\n"))
                            .setFooter("<required> [optional]")
                    ]
                });
            }
        }
    }

    async Delete(guild_id) {
        for (var set of this.sounds)
            if (set.includes(this.selected_soundfile)) {
                set.splice(set.indexOf(this.selected_soundfile), 1);
                FileSystem.unlinkSync(`./Assets/Guild Assets/${guild_id}/${this.selected_soundfile}`);
                return;
            }
    }

    constructor(client, guild_id, channel, adding = false) {
        this.guild_id = guild_id;
        this.client = client;
        var _sounds = GuildSettings.GetProperty(this.guild_id, GuildSettings.PROPERTIES.SOUNDBOARD);
        if (_sounds === null) {
            if (!adding) channel.send(`Guild has no sounds added to its Soundboard, use ".soundboard add" with an audio file attached to add a sound`);
        } else {
            this.sounds = _sounds;
            this.Reload();
            if (!adding) this.SendControls(channel);
        }
    }
}

function Run(message, args, args_with_case, client) {
    if (args[1] == "add") {
        new Soundboard(client, message.guild.id, message.channel, true).Add(message, args_with_case);
        return true;
    }

    new Soundboard(client, message.guild.id, message.channel);

    return true;
}

module.exports = {
    NSFW: false,
    name: "soundboard",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "soundboard" ],
        [ "sb" ]
    ],
    Run
}