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
const Random = __importStar(require("../../../include/Random.js"));
const Utility = __importStar(require("../../../include/Utility.js"));
exports.command = {
    name: "HowX",
    category: "Fun",
    nsfw: false,
    aliases: [["how"]],
    Run: function (message, args, argswithcase, client) {
        if (argswithcase.length < 2)
            return CommandHandler.ExitCode.UsageError;
        let entries = [];
        let max = 100;
        let subject = "";
        if (message.content.includes("-overload"))
            max = Number.MAX_SAFE_INTEGER;
        argswithcase.shift();
        subject = argswithcase.join(" ");
        subject = subject.replace(/<@[0-9]+>/g, "");
        if (message.mentions.users.size > 0)
            for (let user of message.mentions.users.values())
                entries.push(`${user}: ${Random.RandomInteger(0, max)}`);
        else
            entries.push(`${message.author}: ${Random.RandomInteger(0, max)}`);
        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`${Utility.CapitiliseFirstLetter(subject)} Check`)
                    .setDescription(entries.join("\n"))
                    .setColor(Utility.COLOURS.PRIMARY)
            ]
        });
        return CommandHandler.ExitCode.Success;
    }
};
