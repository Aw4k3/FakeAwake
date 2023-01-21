// @ts-check
const Checklist = require("../../include/Checklists.js");

function Run(message, args, args_with_case, client) {
    var checklist = new Checklist.Checklist("Lost Ark Checklist", "https://d1glcu56fxkf6q.cloudfront.net/statics/2022-03-10/images/LostArkIcon.png");

    checklist.tasks = [
        new Checklist.Task("Guild Donations"),
        new Checklist.Task("Una's Dailies"),
        new Checklist.Task("Una's Weeklies (If not already done)"),
        new Checklist.Task("Chaos Dungeons"),
        new Checklist.Task("Guardian Raids"),
        new Checklist.Task("Stronghold Research"),
        new Checklist.Task("Stronghold Dispatches"),
        new Checklist.Task("Rapport"),
        new Checklist.Task("Mokoko Hunt")
    ];

    checklist.Send(client, message.channel);

    return true;
}

module.exports = {
    NSFW: false,
    name: "lostark_checklist",
    category: global.COMMAND_CATEGORIES.GAME_SPECIFIC.NAME,
    aliases: [
        ["lostark", "checklist"],
        ["lostark", "cl"],
        ["la", "checklist"],
        ["la", "cl"]
    ],
    Run
}