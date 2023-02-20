const Discord = require("discord.js");
const FileSystem = require("fs");
const Chroma = require("chroma-js");
const YTDL = require("ytdl-core");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const Status = require("../../include/Status.js");



async function Run(message, args, args_with_case, client) {
    if (args_with_case[1])
        if (YTDL.validateURL(args_with_case[1])) {
            var info = await YTDL.getBasicInfo(args_with_case[1]);
            var YT_DOWNLOADER_CLIENT = new YoutubeMp3Downloader({
                "ffmpegPath": "ffmpeg",                // FFmpeg binary location
                "outputPath": `./Assets/temp`,         // Output file location (default: the home directory)
                "youtubeVideoQuality": "highestaudio", // Desired video quality (default: highestaudio)
                "queueParallelism": 2,                 // Download parallelism (default: 1)
                "progressTimeout": 2000,               // Interval in ms for the progress reports (default: 1000)
                "allowWebm": false                     // Enable download from WebM sources (default: false)
            });

            var ProgressEmbed = new Discord.MessageEmbed()
                .setColor(Chroma(0, 0, 0).hex("rgb"))
                .setDescription(`Progress: 0%`);

            var message = await message.channel.send({ embeds: [ProgressEmbed] });

            YT_DOWNLOADER_CLIENT.download(YTDL.getVideoID(args_with_case[1]));

            YT_DOWNLOADER_CLIENT.on("progress", progress => {
                ProgressEmbed.setDescription([
                    `${Math.round(progress["progress"]["transferred"] / 1024 / 1024 * 100) / 100}/${Math.round(progress["progress"]["length"] / 1024 / 1024 * 100) / 100}MB`,
                    `${Math.round(progress["progress"]["percentage"])}%`
                ].join(" "))
                    .setColor(Chroma(0, Math.round((progress["progress"]["percentage"] / 100) * 255), 0, "rgb").hex("rgb"))
                message.edit({ embeds: [ProgressEmbed] });
            });

            YT_DOWNLOADER_CLIENT.on("finished", async (error, data) => {
                console.log(data);
                console.log(error);

                ProgressEmbed = new Discord.MessageEmbed()
                    .setColor(Status.StatusColor("OK"))
                    .setDescription(`Uploading...`)

                message.edit({ embeds: [ProgressEmbed] });
                await message.channel.send({ files: [new Discord.MessageAttachment(`./Assets/temp/${info.videoDetails.title}.mp3`)] });
                message.delete();

                FileSystem.unlinkSync(`./Assets/temp/${info.videoDetails.title}.mp3`);
            });

            YT_DOWNLOADER_CLIENT.on("error", (error, data) => {
                console.log(data);
                console.log(error);

                ProgressEmbed = new Discord.MessageEmbed()
                    .setColor(Chroma(255, 0, 0, "rgb").hex("rgb"))
                    .setDescription(`${error}`)

                message.edit({ embeds: [ProgressEmbed] });
            });
        }

    return true;
}

module.exports = {
    NSFW: false,
    name: "YoutubeToMp3",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "mp3" ]
    ],
    Run
}