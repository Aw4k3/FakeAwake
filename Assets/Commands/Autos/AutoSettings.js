const FileSystem = require("fs");

function ReadConfig() {
    return JSON.parse(FileSystem.readFileSync("./Assets/Data/AutosSettings.json"));
}

function WriteConfig(c) {
    FileSystem.writeFileSync("./Assets/Data/AutosSettings.json", JSON.stringify(c, null, 2));
}

var config = ReadConfig();

function Run(message, args, args_with_case, client) {
    switch (args[1]) {
        case "exercise":
            switch (args[2]) {
                case "disable":
                case "off":
                case "false":
                    config.Exercise.Enabled = false;
                    break;

                case "enabled":
                case "on":
                case "true":
                    config.Exercise.Enabled = true;
                    break;
            }

            WriteConfig(config);
            message.channel.send(`Exercise timer enabled: \`${config.Exercise.Enabled}\``);
            break;
    }
}

module.exports = {
    NSFW: false,
    name: "autos",
    aliases: [
        [ "autos" ]
    ],
    Run,
    ReadConfig,
    WriteConfig
}