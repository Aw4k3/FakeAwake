// @ts-check

const OpenAI = require("openai");
const FileSystem = require("fs");
const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice");
const Utils = require("../../include/Utils.js");
const Status = require("../../include/Status.js");
const WebClient = require("../../include/webclient.js");

const SECRETS = JSON.parse(FileSystem.readFileSync("D:\FakeAwake Secrets.json", "utf8"));
const OPENAI_CONFIG = new OpenAI.Configuration({ apiKey: SECRETS.OpenAI.Secret });
const OPENAI_API = new OpenAI.OpenAIApi(OPENAI_CONFIG);

var text_settings = {
    model: "text-davinci-003",
    prompt: "",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0
};

var image_settings = {
    prompt: "",
    n: 1,
    size: "1024x1024"
}

async function JoinVC(member) {
    var voice_channel = await member.voice.channel;

    if (voice_channel === null) return false;

    this.voice_connection = DiscordVoice.joinVoiceChannel({
        channelId: voice_channel.id,
        guildId: voice_channel.guild.id,
        adapterCreator: voice_channel.guild.voiceAdapterCreator
    });

    return true;
}

async function Run(message, args, args_with_case, client) {
    // Modify Text Settings
    if (args[0].endsWith("*")) {
        if (message.author.id != "301985885870882827") return;
        var embed = new Discord.MessageEmbed()
            .setFooter("Nothing was changed");

        var _value = 0;
        switch (args[1]) {
            case "temperature":
            case "temp":
                _value = parseFloat(args[2]) || 0.0;
                text_settings.temperature = Utils.Clamp(_value, 0.0, 1.0);
                embed.setFooter(`Tempurature set to ${_value}`);
                break;

            case "maxtokens":
            case "max_tokens":
            case "tokens":
                _value = parseInt(args[2]) || 0;
                text_settings.max_tokens = _value;
                embed.setFooter(`Max Tokens set to ${_value}`);
                break;

            case "topp":
            case "top_p":
                _value = parseFloat(args[2]) || 0.0;
                text_settings.top_p = Utils.Clamp(_value, 0.0, 1.0);
                embed.setFooter(`Top P set to ${_value}`);
                break;

            case "frequency_penalty":
            case "frequencypenalty":
                _value = parseFloat(args[2]) || 0.0;
                text_settings.top_p = Utils.Clamp(_value, 0.0, 1.0);
                embed.setFooter(`Frequency Penalty set to ${_value}`);
                break;

            case "presence_penalty":
            case "presencepenalty":
                _value = parseFloat(args[2]) || 0.0;
                text_settings.top_p = Utils.Clamp(_value, 0.0, 1.0);
                embed.setFooter(`Presence Penalty set to ${_value}`);
                break;
        }

        embed.setDescription([
            `tempurature: ${text_settings.temperature}`,
            `max_tokens: ${text_settings.max_tokens}`,
            `top_p: ${text_settings.top_p}`,
            `frequency_penalty: ${text_settings.frequency_penalty}`,
            `presence_penalty: ${text_settings.presence_penalty}`
        ].join("\n"));

        message.channel.send({ embeds: [embed] });

        return;
    }

    args_with_case.shift();

    // Generate Images
    if (args[0].endsWith("i")) {
        image_settings.prompt = args_with_case.join(" ");
        var m = await message.channel.send("<a:Loading:965027668280111255> generating...");

        try {
            var response = await OPENAI_API.createImage(image_settings);

            WebClient.DownloadFile(response.data.data[0].url, "./Assets/temp/openai_result.png", async () => {
                m.edit("<a:Loading:965027668280111255> uploading...")
                await message.channel.send({ files: [new Discord.MessageAttachment("Assets/temp/openai_result.png")] });
                m.delete();
            });
            // message.edit(url.slice(0, url.indexOf("?")));
        } catch (e) {
            m.edit(`Status: ${e.message}`);
        }

        return;
    }

    // Generate Text
    text_settings.prompt = args_with_case.join(" ");
    var m = await message.channel.send("<a:Loading:965027668280111255> thinking...");

    try {
        var response = await OPENAI_API.createCompletion(text_settings);
        if (response.data.choices[0].text != "") m.edit(response.data.choices[0].text); else message.edit("idk");
    } catch (e) {
        m.edit(`Status: ${e.response.status}, ${e.response.statusText}`);
    }
    
    console.log(`${Utils.GetTimeStamp()} [OpenAI] Begining of Response`);
    console.log(`${Utils.GetTimeStamp()} [OpenAI] Response: ${response.data.choices[0].text.replace("\n", "\\n")}`);
    console.log(`${Utils.GetTimeStamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
    console.log(`${Utils.GetTimeStamp()} [OpenAI] End of Response`);

    // Audio Response System - Incomplete
    if (["summonfakeawake2", "sfa2"].includes(args[0])) {
        var result = await GTTS.getAllAudioBase64(response.data.choices[0].text.replace("\n", "\\n"), {
            lang: "en",
            slow: false,
            host: "https://translate.google.com",
            timeout: 10000
        });

        //FileSystem.writeFileSync("./audio.mp3", result);

        console.log();
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "OpenAIjs",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        // [ "fakeawake2" ],
        // [ "summonfakeawake2" ],
        // [ "fa2" ],
        // ["sfa2"],
        // 
        // [ "fakeawake2i" ],
        // [ "fa2i" ],
        // 
        // [ "fakeawake2*" ],
        // [ "summonfakeawake2" ],
        // [ "fa2*" ],
        // [ "sfa2*" ]
    ],
    Run
}