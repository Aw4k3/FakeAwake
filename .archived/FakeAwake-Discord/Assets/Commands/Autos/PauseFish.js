// @ts-check

const Random = require("../../include/random");
const Utils = require("../../include/Utils.js");

var last_pf_user = null;

function SelectEmote() {
    if (Utils.GetDate() == "14/08/2023") return "<a:PogFish:1008309793158598676>";
    return "<:PauseFish:826541956108648545>";
}


function SendPauseFish(client) {
    if (last_pf_user !== client.user) {
        client.guilds.cache.get("734373940306378832").channels.cache.get("876035515512655872").send(SelectEmote());
    }
}
function Run(message, args, args_with_case, client) {
    last_pf_user = message.author;

    if (Random.RandInt(0, 101) < 20 && !message.author.bot) {
        var timer = Random.RandInt(300000, 1800000);
        console.log(`${Utils.GetTimeStamp()} [Sentience] I want to PauseFish, I will PauseFish in ${timer / 1000} seconds!`);
        
        setTimeout(() => SendPauseFish(client), timer);
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "autoPauseFish",
    aliases: [],
    Run
}