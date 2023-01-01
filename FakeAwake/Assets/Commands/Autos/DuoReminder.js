const FileSystem = require("fs");
const Random = require("../../include/random");
const Utils = require("../../include/Utils.js");

function Run(message, args, args_with_case, client) {
    const DUO_REMINDER_LOG = JSON.parse(FileSystem.readFileSync("./Assets/Data/DuoReminderLog.json"));

    if (DUO_REMINDER_LOG["LastReminderDate"] !== Utils.GetDate("long")) {
        if (DUO_REMINDER_LOG["SendReminder"]) {
            client.channels.cache.get("912280850790481921").send(`${DUO_REMINDER_LOG["ReminderMessages"][Random.RandInt(0, DUO_REMINDER_LOG["ReminderMessages"].length)]} ${Utils.GetDate("long")}`);
        }
        DUO_REMINDER_LOG["LastReminderDate"] = Utils.GetDate("long");
    }

    FileSystem.writeFileSync("./Assets/Data/DuoReminderLog.json", JSON.stringify(DUO_REMINDER_LOG, null, 2));
}

module.exports = {
    NSFW: false,
    name: "duoreminder",
    aliases: [ [] ],
    Run
}