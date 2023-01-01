const path = require("path");
const GoogleAssistant = require("google-assistant");
const DiscordVoice = require("@discordjs/voice");
const DiscordOpus = require("@discordjs/opus");
const Stream = require("stream");
const FileSystem = require("fs");
const NodeOpus = require("node-opus");
const Prism = require("prism-media");
const StreamBuffers = require("stream-buffers");
const Utils = require("../../include/Utils.js");

const SECRETS = JSON.parse(FileSystem.readFileSync("D:\FakeAwake Secrets.json", "utf8"));

// var connection = DiscordVoice.joinVoiceChannel();
var connection = null;
var audio_player = DiscordVoice.createAudioPlayer();
var config = {
    auth: {
        keyFilePath: path.resolve(__dirname, "D:/FakeAwake GoogleAPI Token.json"),
        savedTokensPath: path.resolve(__dirname, "GoogleAPI Token.json")
    },
    conversation: {
        audio: {
            encodingOut: "OPUS_IN_OGG",
            sampleRateOut: 24000
        },
        lang: "en-GB",
        textQuery: "What time is it?", // if this is set, audio input is ignored
        isNew: true,                   // set this to true if you want to force a new conversation and ignore the old state
        screen: {
            isOn: false                // set this to true if you want to output results to a screen
        },
        showDebugInfo: true
    }
};

const Assistant = new GoogleAssistant(config.auth);
var message = { };
var last_message = {
    channel: {
        id: ""
    }
};
var DoubleResponseBlock = false;

// Starts a new conversation with the assistant
function StartConversation(conversation) {
    conversation
        .on("audio-data", audio_data => {
            // var readable = Stream.Readable.from(audio_data);
            var readable = new StreamBuffers.ReadableStreamBuffer({ frequency: 20, chunkSize: 160 });
            readable.put(audio_data);

            if (connection !== null) {
                // , { inputType: DiscordVoice.StreamType.OggOpus }
                var audio_resource = DiscordVoice.createAudioResource(new DiscordOpus.OpusEncoder(48000, 2).encode(readable.read()).toString());
                audio_player.play(audio_resource);
            }
        })
        .on('debug-info', info => console.log(`${Utils.GetTimeStamp()} [Assistant: Info] ${info}`))
        .on("response", text => {
            if (!DoubleResponseBlock) {
                if (text !== "" && text.toLowerCase().includes("northolt") === false) {
                    message.channel.send(text);
                    console.log(`${Utils.GetTimeStamp()} Response: "${text}"`)
                } else {
                    message.channel.send("Not sure how to respond to that.");
                }
                DoubleResponseBlock = true;
            }

            setTimeout(() => DoubleResponseBlock = false, 150);
        })
        .on("ended", (error, continueConversation) => {
            // once the conversation is ended, see if we need to follow up
            if (error) console.log("Conversation Ended Error:", error);
            else if (continueConversation) Assistant.start();
            else console.log("Conversation Complete");
        })
        .on("error", error => {
            console.log(`${Utils.GetTimeStamp()} [Assistant: Error] ${error}`);
        })
};

// will start a conversation and wait for audio data
// as soon as it"s ready
Assistant
    .on("ready", () => Assistant.start(config.conversation))
    .on("started", StartConversation)
    .on("error", error => console.log(`${Utils.GetTimeStamp()} ${error}`))

async function GetVoiceChannel(message) {
    return await message.member.voice.channel;
}

async function Run(message, args, args_with_case, client) {
    if (args[0] === "summon") {
        var voice_channel = await GetVoiceChannel(message);

        connection = DiscordVoice.joinVoiceChannel({
            channelId: voice_channel.id,
            guildId: voice_channel.guild.id,
            adapterCreator: voice_channel.guild.voiceAdapterCreator
        });

        connection.subscribe(audio_player);
            // connection.receiver.speaking.on("start", user_id => {
            //     var stream = connection.receiver.subscribe(user_id, { end: { behavior: DiscordVoice.EndBehaviorType.AfterSilence, duration: 3 } });
            // 
            //     pipeline(stream, FileSystem.createWriteStream("./audio.mp3"), e => console.log(e));
            //     console.log("recorded");
            // });
    }

    message = message;
    if (last_message.channel.id === message.channel.id) config.conversation.isNew = false;
    else config.conversation.isNew = true;
    last_message = message;
    args.shift();
    config["conversation"]["textQuery"] = args.join(" ");
    Assistant.start(config["conversation"], StartConversation)

    return true;
}

module.exports = {
    NSFW: false,
    name: "assistant",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "fakeawake" ],
        [ "fa" ],
        [ "summon" ],
    ],
    Run
}