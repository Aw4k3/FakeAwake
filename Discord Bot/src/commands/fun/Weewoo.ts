import * as Discord from "discord.js";
import * as Sharp from "sharp";
import * as FileSystem from "fs";
import * as MySql from "mysql";
import * as CommandHandler from "../../CommandHandler.js";
import * as Settings from "../../../helpers/BotSettings.js";
import * as WebClient from "../../../helpers/WebClient.js";
import * as Utility from "../../../helpers/Utility.js";

const TEMP_PATH: string = Settings.TEMP_PATH.concat("/weewoo/");
const ASSETS_PATH: string = Settings.ASSETS_PATH.concat("/weewoo/");
let JailCells: Map<string, string> = new Map<string, string>();

Sharp.cache(false);

export const command: CommandHandler.ICommand = {
    name: "Horny Jail",
    category: "Fun",
    nsfw: false,
    aliases: [["weewoo"]],
    devMode: true,
    Initialise(client: Discord.Client) {
        // Load database entries
        

        // Load JailCells
        JailCells.set("Default", ASSETS_PATH.concat("DefaultPrison.webp"));
    },
    Run: async function (message: Discord.Message, args: string[], argsWithCase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        // Preconditions
        if (message.mentions.members.size < 1) {
            message.channel.send("Usage: .weewoo `@mention` • You can chain multiple members");
            return CommandHandler.ExitCode.UsageError;
        }

        // Download member images
        let imagePaths: string[] = [];
        for (let member of message.mentions.members.values()) {
            let extension = member.displayAvatarURL().split(".").pop();
            try {
                await WebClient.DownloadFile(member.displayAvatarURL(), TEMP_PATH.concat(member.id, ".", extension));
            } catch (e) {
                CommandHandler.LogError(`${Utility.GenerateTimestamp()} ${e}`);
                return CommandHandler.ExitCode.InternalError;
            }
            imagePaths.push(TEMP_PATH.concat(member.id, ".", extension));
        }

        // Image Processing
        // Compile members
        let membersCanvas = Sharp.default({
            create: {
                width: 128 * imagePaths.length,
                height: 128,
                channels: 3,
                background: { r: 0, g: 0, b: 0 }
            }
        });

        let offsetX = 0;
        let composition: Sharp.OverlayOptions[] = [];
        for (let imagePath of imagePaths) {
            let temp = await Sharp.default(imagePath)
                .resize({ width: 128, height: 128, fit: Sharp.fit.fill })
                .png()
                .toBuffer();

            composition.push({
                input: temp,
                top: 0,
                left: offsetX,
            });

            offsetX += 128;
        }

        membersCanvas.composite(composition);
        membersCanvas.png();
        /*
        membersCanvas.resize({
            width: 1600,
            fit: Sharp.fit.fill
        });
        */

        // Add members to Jail
        let canvas = Sharp.default(JailCells.get("Default"));
        canvas.composite([
            {
                input: await membersCanvas.toBuffer(),
                gravity: Sharp.gravity.centre
            }
        ]);

        canvas.jpeg();
        await canvas.toFile(TEMP_PATH.concat("weewoo.jpg"));

        // Send Embed
        await message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle("Horny Jail")
                    .setDescription(`${message.author} weewoos ${FormatMentions(Array.from(message.mentions.members.values()))}`)
                    .setImage("attachment://weewoo.jpg")
            ],
            files: [
                new Discord.AttachmentBuilder(TEMP_PATH.concat("weewoo.jpg"))
            ]
        });

        // Clean up
        for (var i = 0; i < imagePaths.length; i++) FileSystem.unlinkSync(imagePaths[i]);

        return CommandHandler.ExitCode.Success
    }
}

class JailEntry {
    private memberId: string = "-1";
    private member: Discord.GuildMember = null;
    private jailCount = -1;
    private jailedByCounts: Map<string, number> = new Map<string, number>();

    constructor(member: Discord.GuildMember, jailCount: number, jailByCounts: Map<string, number>) {
        this.member = member;
        this.memberId = member.id;
        this.jailCount = jailCount;
        this.jailedByCounts = jailByCounts;
    }

    Increment(jailedBy: string): void {
        this.jailCount++;
        let temp: number = this.jailedByCounts.get(jailedBy);
        this.jailedByCounts.set(jailedBy, ++temp);
    }

    UpdateDatabase(): void {

    }
}

function FormatMentions(members: Discord.GuildMember[]): string {
    let finalmember: Discord.GuildMember = members.pop();
    let result: string = members.join(", ").concat(" and ", finalmember.toString());
    return result;
}