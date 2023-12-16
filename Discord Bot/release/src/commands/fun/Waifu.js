"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Discord = __importStar(require("discord.js"));
const CommandHandler = __importStar(require("../../CommandHandler.js"));
const Utility = __importStar(require("../../../helpers/Utility.js"));
let instances = new Map();
const REROLL_BTN = new Discord.ButtonBuilder()
    .setCustomId("reroll")
    .setLabel("Reroll")
    .setStyle(Discord.ButtonStyle.Success);
const I_LOST_BTN = new Discord.ButtonBuilder()
    .setCustomId("i-lost")
    .setLabel("I Lost")
    .setStyle(Discord.ButtonStyle.Primary);
const WAIFU_MENU = new Discord.StringSelectMenuBuilder()
    .setCustomId("endpoint")
    .setPlaceholder("Waifu Type")
    .addOptions([
    {
        label: "Avatar",
        value: "avatar",
        emoji: "772950364437610518"
    },
    {
        label: "Cuddle",
        value: "cuddle",
        emoji: "883376930282414100"
    },
    {
        label: "Feed",
        value: "feed",
        emoji: "852926235919122452"
    },
    {
        label: "Foxgirl",
        value: "fox_girl",
        emoji: "800166987099144192"
    },
    {
        label: "Gasm",
        value: "gasm",
        emoji: "857029075260407819"
    },
    {
        label: "Genetically Engineered Catgirl",
        value: "gecg",
        emoji: "951057797037064213"
    },
    {
        label: "Goose",
        value: "goose",
        emoji: "918653131565432852"
    },
    {
        label: "Hug",
        value: "hug",
        emoji: "1008812073368694915"
    },
    {
        label: "Kiss",
        value: "kiss",
        emoji: "788152154585301022"
    },
    {
        label: "Lewd",
        value: "lewd",
        emoji: "801906570829103144"
    },
    {
        label: "Lizard",
        value: "lizard",
        emoji: "852923680718848060"
    },
    {
        label: "Meow",
        value: "meow",
        emoji: "885283542576295957"
    },
    {
        label: "Neko",
        value: "neko",
        emoji: "902939601814052904"
    },
    {
        label: "Neko Gif",
        value: "ngif",
        emoji: "902939601814052904"
    },
    {
        label: "Pat",
        value: "pat",
        emoji: "822152587033837579"
    },
    {
        label: "Slap",
        value: "slap",
        emoji: "638480830204870710"
    },
    {
        label: "Smug",
        value: "smug",
        emoji: "701255431854489630"
    },
    {
        label: "Spank",
        value: "spank",
        description: "? Possible NSFW results",
        emoji: "648393455264989196"
    },
    {
        label: "Tickle",
        value: "tickle",
        emoji: "852924118239936522"
    },
    {
        label: "Wallpaper",
        value: "wallpaper",
        description: "? Possible NSFW results",
        emoji: "586303697739448320"
    },
    {
        label: "Woof",
        value: "woof",
        emoji: "808379650341339175"
    }
]);
const ACTION_ROW_MENU = new Discord.ActionRowBuilder()
    .addComponents(WAIFU_MENU);
const ACTION_ROW_BUTTONS = new Discord.ActionRowBuilder()
    .addComponents(REROLL_BTN, I_LOST_BTN);
class Instance {
    endpoint = "avatar";
    message = null;
    embed = new Discord.EmbedBuilder();
    interactioncollector = null;
    constructor(channel) {
        this.Instance(channel);
    }
    async Instance(channel) {
        let response = await fetch(`https://nekos.life/api/v2/img/${this.endpoint}`);
        let data = await response.json();
        this.embed.setTitle("Waifus")
            .setImage(data.url)
            .setTitle(`Waifus: ${Utility.CapitiliseFirstLetter(this.endpoint)}`);
        this.message = await channel.send({ embeds: [this.embed], components: [ACTION_ROW_MENU, ACTION_ROW_BUTTONS] });
        this.interactioncollector = this.message.createMessageComponentCollector();
        this.interactioncollector.on("collect", this.InteractionHandler.bind(this));
    }
    Deinitialise() {
        this.message.edit({ embeds: [this.embed], components: [] });
    }
    async InteractionHandler(interaction) {
        switch (interaction.customId) {
            case "endpoint":
                {
                    this.endpoint = interaction.values[0];
                    let response = await fetch(`https://nekos.life/api/v2/img/${this.endpoint}`);
                    let data = await response.json();
                    this.embed.setImage(data.url)
                        .setTitle(`Waifus: ${Utility.CapitiliseFirstLetter(this.endpoint)}`);
                }
                break;
            case "i-lost":
                this.embed.setFooter({ text: `${interaction.member.displayName} lost >:D` });
                break;
            default:
                {
                    let response = await fetch(`https://nekos.life/api/v2/img/${this.endpoint}`);
                    let data = await response.json();
                    this.embed.setImage(data.url)
                        .setTitle(`Waifus: ${Utility.CapitiliseFirstLetter(this.endpoint)}`);
                }
                break;
        }
        this.message.edit({ embeds: [this.embed], components: [ACTION_ROW_MENU, ACTION_ROW_BUTTONS] });
        interaction.deferUpdate();
    }
}
exports.command = {
    name: "Waifu",
    category: "Fun",
    nsfw: false,
    aliases: [["waifu"]],
    devMode: false,
    Run: function (message, args, argswithcase, client) {
        if (instances.has(message.channel.id))
            instances.get(message.channel.id).Deinitialise();
        instances.set(message.channel.id, new Instance(message.channel));
        return CommandHandler.ExitCode.Success;
    }
};
