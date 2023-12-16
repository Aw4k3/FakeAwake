import * as Discord from "discord.js";
import * as CommandHandler from "../../CommandHandler.js";
import * as Utility from "../../../helpers/Utility.js";

export const command: CommandHandler.ICommand = {
    name: "Ping",
    category: "Utility",
    nsfw: false,
    aliases: [
        ["ping"]
    ],
    devMode: false,
    Run: async function (message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<CommandHandler.ExitCode> {
        let embed = new Discord.EmbedBuilder();
        embed.setDescription("<a:Loading:965027668280111255> Pinging...");
        embed.setColor(Utility.COLOURS.PRIMARY as Discord.ColorResolvable);
        let m = await message.channel.send({ embeds: [embed] });
        embed.setDescription(`**Bot Latency:** ${m.createdTimestamp - message.createdTimestamp}ms\n**API Latency:** ${client.ws.ping}ms`);
        m.edit({ embeds: [embed] });

        return CommandHandler.ExitCode.Success;
    }
}