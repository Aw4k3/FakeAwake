import * as Discord from "discord.js";
import * as FileSystem from "fs";
import * as Request from "https";
import * as NekosLife from "nekos.life";
import * as Random from "../../include/Random.js";
import * as Utils from "../../include/Utils.js";
import * as Status from "../../include/Status.js";

var instances: Map<string, Instance> = new Map();

const REROLL_BUTTON = new Discord.MessageButton()
    .setCustomId("reroll")
    .setLabel("Reroll")
    .setStyle("SUCCESS");


const WAIFU_MENU = new Discord.MessageSelectMenu()
    .setCustomId("skip-to")
    .setPlaceholder("Skip to...");

const ACTION_ROW = new Discord.MessageActionRow()
    .addComponents(WAIFU_MENU);

class Instance {
    type: string = "avatar";
    embed: Discord.MessageEmbed = new Discord.MessageEmbed();
}

export async function Run(message: Discord.Message, args: string[], argswithcase: string[], client: Discord.Client): Promise<boolean> {

    return true;
}