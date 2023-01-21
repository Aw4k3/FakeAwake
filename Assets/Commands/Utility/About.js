const Discord = require("discord.js");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    message.channel.send({
        embeds: [
            new Discord.MessageEmbed()
                .setTitle("FakeAwake Discord Bot")
                .setColor(Status.StatusColor("OK"))
                // .setDescription(`Spawed on February 25, 2021\nSpawned by <@!301985885870882827>\n~~Body~~ Server count: ${client.guilds.cache.size}\n[Invite Link](https://discord.com/api/oauth2/authorize?client_id=707698652076048406&permissions=414501423168&scope=bot)\nGithub: https://github.com/Aw4k3/FakeAwake-Discord-Bot`)
                .setDescription([
                    `Spawed on 25 February 2021`,
                    `Spawned by <@!301985885870882827>`,
                    `Server count: ${client.guilds.cache.size}`,
                    `[Invite Link](https://discord.com/api/oauth2/authorize?client_id=707698652076048406&permissions=414501423168&scope=bot)`,
                    `[Github](https://github.com/Aw4k3/FakeAwake-Discord-Bot)`
                ].join("\n"))
                .setFooter("I have two brains, I double wonder why I exist :)")
        ]
    });

    return true;
}

module.exports = {
    NSFW: false,
    name: "about",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "about" ],
        [ "invite" ],
        [ "link" ]
    ],
    Run
}