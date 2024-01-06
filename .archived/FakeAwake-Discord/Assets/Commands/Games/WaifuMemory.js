const Discord = require("discord.js");
const Random = require("../../include/Random.js");
const Utils = require("../../include/Utils.js");
const Status = require("../../include/Status.js");
const FileSystem = require("fs");
const Neko = require("nekos.life");
const Https = require("https");

const NekoClient = new Neko();

var instances = [];

class WaifuMemoryGame {
    channel = null;
    instance = null;
    score = 0;
    waifu_list = [];
    current_waifu = "";

    embed = new Discord.MessageEmbed()
        .setTitle("Waifu Memory Test")
        .setDescription("Does this waifu look familiar?")
        .setColor("#edd6ff")
        .setFooter(`nya~`);

    BUTTONS = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId("seen")
                .setLabel("Seen")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("new")
                .setLabel("New")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("i-lost")
                .setLabel("I Lost")
                .setStyle("SECONDARY")
    );

    context = { embeds: [this.embed], components: [this.BUTTONS] };

    async Next() {
        this.score++;
        if (this.current_waifu != "") this.waifu_list.push(this.current_waifu);

        if (Random.RandFloat(0, 1) < 0.45) {
            this.current_waifu = this.waifu_list[Random.RandInt(0, this.waifu_list.length)];
            this.embed.setImage(this.current_waifu);
            this.embed.setFooter(`Score: ${this.score}`);
        } else {
            await NekoClient.sfw.neko().then(image => {
                console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
                this.current_waifu = image.url;
                this.embed.setImage(image.url);
                this.embed.setFooter(`Score: ${this.score}`);
            });
        }
               
    }

    Fail() {
        this.embed.setTitle("Waifu Memory Test");
        this.embed.setDescription("Fail");
        this.embed.setColor("#ff0000");

        this.context = { embeds: [this.embed], components: [] };
    }

    async Send(instantiate = false) {
        if (instantiate) this.instance = await this.channel.send(this.context);
        else await this.instance.edit(this.context);

        var filter = (x) => { return true; }
        var interaction_collector = this.instance.createMessageComponentCollector({ filter });

        interaction_collector.on("collect", async i => {
            switch (i.customId) {
            case "seen":
                if (this.waifu_list.includes(this.current_waifu)) await this.Next();
                else this.Fail();
                // this.Send();
                break;

            case "new":
                if (this.waifu_list.includes(this.current_waifu)) this.Fail();
                else await this.Next();
                // this.Send();
                break;

            case "i-lost":
                this.channel.send(`<:Tissue:857028007700594738> Tissues for ${i.user} because they just lost to ${this.current_waifu}`);
                // this.Send();
                break;
        }
            // console.log(`~~~~~~~~~~~~New Round~~~~~~~~~~~~`);
            // console.log(`Waifu List:`);
            // console.log(this.waifu_list);
            // console.log(`Current Waifu: ${this.current_waifu}`);
            // console.log(`Embed Image URL: ${this.embed.image.url}`);
            i.update(this.context);
        });
    }

    constructor(channel) {
        this.channel = channel;
        NekoClient.sfw.neko().then(image => {
            console.log(`${Utils.GetTimeStamp()} Fetched url from Neko.life ${image.url}`);
            this.current_waifu = image.url;
            this.embed.setImage(image.url);
            this.embed.setFooter(`Score: ${this.score}`);
            this.Send(true);
        });
    }
}

function Run(message, args, args_with_case, client) {
    instances.push(new WaifuMemoryGame(message.channel));

    return true;
}

module.exports = {
    NSFW: false,
    name: "waifumemorygame",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        [ "waifumemory" ],
        [ "waifumemorygame" ]
    ],
    Run
}
