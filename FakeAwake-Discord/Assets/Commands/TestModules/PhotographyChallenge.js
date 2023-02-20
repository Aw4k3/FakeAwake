const Discord = require("discord.js");
const FileSystem = require("fs");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");

class Entry {
    User = null;
    Msg = null;

    constructor(u, m) {
        this.User = u;
        this.Msg = m;
    }
}

var Queue = [];
var Busy = false;
var jObject = JSON.parse(FileSystem.readFileSync("./Assets/Data/PhotoChallengeData.json"));
var dClient;

// function assignClient(c) {
//     dClient = c;
// }
// 
function submit(message, client) {
    Queue.push(message);

    if (!Busy) {
        resolveSubmission(message, client)
    }
}
//
// function reactionHandler() {
// 
// }
// 
// function addReactionHandlers() {
// 
// }

function resolveSubmission(message, client) {
    while (Queue.length > 0 && !Busy) {
        if (Queue[0].attachments.size > 0) {
            Busy = true;

            // Download Image
            console.log(`${Utils.GetTimeStamp()} Downloading photo submission... ${Queue[0].attachments.first().url}`);
            
            var fileExtension = Queue[0].attachments.first().name.split(".")[1];
            WebClient.DownloadFile(Queue[0].attachments.first().url, `./Assets/temp/submission.${fileExtension}`, function () {
                console.log(`${Utils.GetTimeStamp()} Finished downloading photo submission`);

                Queue[0].delete();
                
                // 8MB file size check
                if (FileSystem.statSync(`./Assets/temp/submission.${fileExtension}`).size > 8 * 1024 * 1024) {
                    // Failed
                    Queue[0].channel.send(`${message.author}, lesu than eighto megabytu preasu.`);
                    Queue.shift();
                    Busy = false
                } else {
                    // Pass
                    // Reupload Image
                    client.channels.cache.get("908000435787427860").send({ files: [new Discord.MessageAttachment(`./Assets/temp/submission.${fileExtension}`)] }).then(message => {
                        message.react("<:GreenTick:908774720630046772>");
                        jObject["Entries"].push(new Entry(message.author, message));
                        FileSystem.writeFileSync("./Assets/Data/PhotoChallengeData.json", JSON.stringify(jObject, null, 2));
                        Queue[0].channel.send(`${message.author}, thanku you foru youru submissiono, havo somu chocorato miruku.`);
                        Queue[0].channel.send("<:waifuchoccymilk:899494277044908042>");
                        Queue.shift();
                        Busy = false
                    });
                }
            });
        } else {
            Queue.shift();
        }
    }

    return true;
}

module.exports = {
    name: "photoChallenge",
    aliases: [ [] ],
    submit
    // assignClient
}