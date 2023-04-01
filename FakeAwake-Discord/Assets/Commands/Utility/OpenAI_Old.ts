import * as Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as OpenAi from "openai";
import * as FileSystem from "fs";
import * as GoogleTts from "google-tts-api";
import * as WebClient from "../../include/webclient.js";
import * as Utils from "../../include/Utils.js";

const SECRETS = JSON.parse(FileSystem.readFileSync("./secrets/FakeAwake Secrets.json", "utf8"));
const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: SECRETS.OpenAI.Secret });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

var settings = {
    text: {
        model: "text-davinci-003",
        prompt: "",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    },
    image: {
        prompt: "",
        n: 1,
        size: "1024x1024"
    }
}

class VoiceAssisstant {
    static Instances: Map<string, VoiceAssisstant> = new Map();
    guildid: string = "";
    connection: DiscordVoice.VoiceConnection;
    audioplayer: DiscordVoice.AudioPlayer = new DiscordVoice.AudioPlayer();
    queue: string[] = [];
    isplaying: boolean = false;

    constructor(vc: Discord.VoiceBasedChannel) {
        this.guildid = vc.guild.id;
        this.connection = DiscordVoice.joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator as unknown as DiscordVoice.DiscordGatewayAdapterCreator
        });


        this.connection.subscribe(this.audioplayer);

        // Event Handlers
        this.connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, this.DisconnectHandler.bind(this));
        this.audioplayer.on(DiscordVoice.AudioPlayerStatus.Idle, this.PlayerIdlingHandler.bind(this));
        this.audioplayer.on("error", this.PlayerErrorHandler.bind(this));
    }

    async GenerateResponse(prompt: string) {
        if (prompt == null) return;
        let Urls = await GoogleTts.getAllAudioUrls(prompt, { lang: "en-GB" });
        for (let item of Urls) this.queue.push(item.url);
        if (!this.isplaying) this.Play();
    }

    async Play() {
        // Stream Audio
        this.isplaying = true;
        var audioresource = DiscordVoice.createAudioResource(this.queue[0], { inputType: DiscordVoice.StreamType.Opus });
        this.audioplayer.play(audioresource);
    }

    // Event Handlers
    PlayerIdlingHandler(): void {
        this.queue.shift();

        if (this.queue.length < 1) {
            this.isplaying = false;
            this.connection.destroy();
        } else {
            this.Play();
        }
    }

    DisconnectHandler(): void {
        try {
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Signalling, 5000);
            DiscordVoice.entersState(this.connection, DiscordVoice.VoiceConnectionStatus.Connecting, 5000);
        } catch (e) {
            console.log(`${Utils.GetTimeStamp()} ${e}`);
        }
    }

    PlayerErrorHandler(error): void {
        console.log(`${Utils.GetTimeStamp()} Error: ${error.message} with resource ${error.resource.metadata.title}`);
    }
}

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {
    var operation: String = args[0].charAt(args[0].length - 1);
    argswithcase.shift();

    switch (operation) {
        case "i":
            settings.image.prompt = argswithcase.join(" ");
            var m: Discord.Message = await message.channel.send("<a:Loading:965027668280111255> generating...");

            try {
                let response = await OPENAI_API.createImage(settings.image as OpenAi.CreateImageRequest);

                WebClient.DownloadFile(response.data.data[0].url, "./Assets/temp/openai_result.png", async () => {
                    m.edit("<a:Loading:965027668280111255> uploading...")
                    await message.channel.send({ files: [new Discord.MessageAttachment("Assets/temp/openai_result.png")] });
                    m.delete();
                });
            } catch (e) {
                m.edit(`Status: ${e.message}`);
            }
            break;

        case "2":
            let response;
            settings.text.prompt = argswithcase.join(" ");
            var m: Discord.Message = await message.channel.send("<a:Loading:965027668280111255> thinking...");

            try {
                response = await OPENAI_API.createCompletion(settings.text as OpenAi.CreateCompletionRequest);
                if (response.data.choices[0].text != "") m.edit(response.data.choices[0].text); else message.edit("idk");
            } catch (e) {
                m.edit(`Status: ${e.response.status}, ${e.response.statusText}`);
            }

            console.log(`${Utils.GetTimeStamp()} [OpenAI] Begining of Response`);
            console.log(`${Utils.GetTimeStamp()} [OpenAI] Response: ${response.data.choices[0].text.replace("\n", "\\n")}`);
            console.log(`${Utils.GetTimeStamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
            console.log(`${Utils.GetTimeStamp()} [OpenAI] End of Response`);

            if (args[0].startsWith("s")) {
                // Pre conditions
                let vc = await message.member.voice.channel;
                if (vc == null) {
                    message.channel.send(`${message.member.user}, join vc if you want me to chat to you babes.`);
                    break;
                }

                if (!vc.joinable) {
                    message.channel.send(`${message.member.user}, I can't join your vc.`);
                    break;
                }

                // Speak
                let g_id: string = message.guild.id;
                if (!VoiceAssisstant.Instances.has(g_id)) VoiceAssisstant.Instances.set(g_id, new VoiceAssisstant(vc));
                VoiceAssisstant.Instances.get(g_id).GenerateResponse(response.data.choices[0].text);
                m.edit(`(Speaking) ${response.data.choices[0].text.trim()}`);
            }

            break;
    }

    return true;
}




export const NSFW: boolean = false;
export const title: string = "OpenAI-TD3";
export const category: string = global.COMMAND_CATEGORIES.UTILITY.NAME;
export const aliases: string[][] = [
    // Text Response
    ["fakeawake2"],
    ["fa2"],

    // Text + Voice Response
    ["summonfakeawake2"],
    ["sfa2"],

    // Image Response
    ["fakeawake2i"],
    ["fa2i"]
];