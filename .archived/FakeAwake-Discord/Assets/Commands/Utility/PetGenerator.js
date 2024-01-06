const Discord = require("discord.js");
const FileSystem = require("fs");
//const petPetGif = require("pet-pet-gif");
const Status = require("../../include/Status.js");

function Run(message, args, args_with_case, client) {
    /*
    if (message.mentions.users.size) {
        message.mentions.users.forEach(user => {
            var petGif = petPetGif(user.avatarURL);

            FileSystem.writeFile("./Assets/temp/petpet.gif", petGif, function (err) {
                console.log(`${Utils.GetTimeStamp()} ${err}`)
            });

            message.channel.send(new Discord.MessageEmbed()
                .setTitle("PetPet")
                .setColor(Status.StatusColor("OK"))
                .attachFiles(["./Assets/temp/petpet.gif"])
                .setImage("attachment://petpet.gif")
                .setFooter("Pet :)")
            );
        });
    } else {
        message.channel.send("awake is a lazy and didnt code this part yet");
    }
    */
    return true;
}

module.exports = {
    NSFW: false,
    name: "petGenerator",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [ [] ],
    Run
}