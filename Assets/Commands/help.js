const Discord = require("discord.js");
const CommandHandler = require("../include/CommandHandler.js");
const Status = require("../include/Status.js");
const Random = require("../include/Random.js");

const HELP_TITLES = [
    "Linus Tech Tips",
    "Linus Sex Tips",
    "Linus Finger Tips",
    "Oculus Support",
    "Steam Support",
    "Big Bojo Hotline (Boris Johnson)",
    "Billy's guide on how to get Waifus"
];

function Run(message, args, args_with_case, client) {
    /*
    message.channel.send(
        {
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle(HELP_TITLES[Random.RandInt(0, HELP_TITLES.length)])
                    .setColor(Status.StatusColor("OK"))
                    .addFields(
                        // AI
                        { name: ":robot: AI", value: "`fakeawake|fa`" },

                        // Beat Saber
                        { name: "<a:PepoSabers:747199106262237284> Beat Saber", value: "`bs maplink` `bsr`" },

                        // Christmas
                        { name: "<:PandaSantaCookie:918653194270289971> Christmas", value: "`santahat` `snowball`" },

                        // Monies
                        { name: "<:PauseFishCoin:880124778227335228> Banking [bank...|banking...]", value: "`bal|balance|money|monies` `send` `setactivecurrency|sec`" },

                        // Music
                        { name: ":musical_note: Music", value: "`play` `next|skip` `dc|disconnect|fuckoff|leave|stop|yeet`" },

                        // Fun
                        { name: ":game_die: Fun", value: "`420` `69` `8ball` `awake` `audioplayer|ap|play|playsound` `baka` `bark` `bonk` `bubblewrap` `cbt` `chokemeplz|chokemepls|chokemeplease` `coffeeart|ca` `coinflip` `doomfish` `hate` `hornylog` `howdrunk` `howgay` `howhorny` `hug` `love` `pp|makepp` `oculus` `thisisfine|tif` `ratemypp` `roll` `sb|soundboard` `trap` `tuck|tuckin` `waifu` `weewoo`" },

                        // Guild Settings 
                        { name: ":cookie: Guild Settings", value: "`botchannel|botchannels|bc|bcs` `broadcastchannel|broadcastchannels|bcc|bccs` `prefix|setprefix`" },

                        // Image Tools
                        { name: ":paintbrush: Image Tools", value: "`it newsolid` `it edit`" },

                        // Utilites
                        { name: ":gear: Utility", value: "`about` `choice` `me` `ping` `randnum` `stringmanipulation|sm`" }
                    )
                    .setFooter("Commands List")
            ]
        }
    );
    */

    message.channel.send({ embeds: [CommandHandler.GetHelpMenu()]});

    return true;
}

module.exports = {
    NSFW: false,
    name: "help",
    aliases: [
        [ "help" ]
    ],
    Run
}