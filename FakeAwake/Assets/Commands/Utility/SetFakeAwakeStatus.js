const FileSystem = require("fs");

function Run(message, args, args_with_case, client) {
    config = {
        activities: [{
            type: args_with_case[1].toUpperCase(),
            name: args_with_case.slice(2, args.length).join(" ")
        }]
    };

    client.user.setPresence(config);
    FileSystem.writeFileSync("./Assets/Data/FakeAwakeStatus.json", JSON.stringify(config, null, 2));

    return true;
}

module.exports = {
    NSFW: false,
    name: "fakeawakestatus",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        [ "status" ]
    ],
    Run
}