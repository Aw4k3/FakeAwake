import * as Discord from "discord.js";
import * as Sharp from "sharp";
import * as FileSystem from "fs";
import * as CommandHandler from "../../../CommandHandler.js";
import * as WebClient from "../../../../helpers/WebClient.js";
import * as Settings from "../../../../helpers/BotSettings.js";
import * as Utility from "../../../../helpers/Utility.js";

const TEMP_PATH: string = Settings.TEMP_PATH.concat("/santahat/");
const ASSETS_PATH: string = Settings.ASSETS_PATH.concat("/santahat/");

export const command: CommandHandler.ICommand = {
    name: "Santa Hat",
    category: "Fun",
    nsfw: false,
    aliases: [
        ["santahat"],
        ["sh"]
    ],
    devMode: false,
    Run: async function (message: Discord.Message, args: string[], argsWithCase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        let member: Discord.GuildMember = null;

        // Santa hat another member
        if (message.mentions.members.size > 0) member = message.mentions.members.first();

        // Santa hat yourself
        else member = message.member;

        // Prepare Download
        let url: string = member.displayAvatarURL();
        let extension: string = member.displayAvatarURL().split(".").pop();
        let profilePicturePath: string = TEMP_PATH.concat(member.id, ".", extension);

        // Download profile picture
        try {
            await WebClient.DownloadFile(member.displayAvatarURL(), profilePicturePath);
        } catch (e) {
            CommandHandler.LogError(`${Utility.GenerateTimestamp()} ${e}`);
            return CommandHandler.ExitCode.InternalError;
        }

        // Composite
        let canvas = Sharp.default({
            create: {
                background: { r: 0, g: 0, b: 0, alpha: 0 },
                channels: 4,
                height: 210,
                width: 180
            }
        });

        let composition: Sharp.OverlayOptions[] = [
            {
                input: profilePicturePath,
                top: 69,
                left: 7
            },
            {
                input: await Sharp.default(ASSETS_PATH.concat("SantaHat.png")).toBuffer(),
                top: 5,
                left: 4
            }
        ];

        canvas.composite(composition);
        canvas.png();
        await canvas.toFile(TEMP_PATH.concat("santahat.png"));

        // Send Image
        await message.channel.send({
            files: [
                new Discord.AttachmentBuilder(TEMP_PATH.concat("santahat.png"))
            ]
        });

        // Clean up
        FileSystem.unlinkSync(TEMP_PATH.concat("santahat.png"));
        FileSystem.unlinkSync(profilePicturePath);

        return CommandHandler.ExitCode.Success;
    }
}