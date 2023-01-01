// @ts-check
const Discord = require("discord.js");

const STATUS = {
    incomplete: "<:RedCross:908075811305844787>",
    complete: "✅"
}

class Task {
    task = "";
    complete = false;
    status_icon = "<:RedCross:908075811305844787>"
    icon = "";

    constructor(task, complete = false, status_icon = STATUS.incomplete, icon = "") {
        this.task = task;
        this.complete = complete;
        this.status_icon = status_icon;
        this.icon = icon;
    }

    ToString() {
        if (this.icon !== "") return `${this.status_icon} ${this.task}`;
        else return `${this.status_icon} ${this.icon} ${this.task}`;
    }
}

class Checklist {
    name = "";
    icon = null;
    tasks = [];
    context = { embeds: [], components: [] };
    embed = new Discord.MessageEmbed();
    MARK_ITEM_DROPDOWN = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId("mark-item")
                .setPlaceholder("Select item to mark as complete")
    );

    CreateChecklistOptions() {
        var items = [];

        for (var task of this.tasks) items.push({
            label: task.task,
            value: task.task,
            emoji: task.status_icon
        });

        this.MARK_ITEM_DROPDOWN.setComponents(
            new Discord.MessageSelectMenu()
                .setCustomId("mark-item")
                .setPlaceholder("Select item to mark as complete")
                .setOptions(items)
        );

        return this.MARK_ITEM_DROPDOWN;
    }

    GetTasks() {
        var result = [];
        for (var task of this.tasks) result.push(task.ToString());
        return result;
    }

    GetContext() {
        this.embed.setTitle(this.name)
            .setDescription(this.GetTasks().join("\n"));

        if (this.icon != null) this.embed.thumbnail = this.icon;

        this.context.embeds = [this.embed];
        this.context.components = [this.CreateChecklistOptions()];

        return this.context;
    }

    Send(client, channel) {
        channel.send(this.GetContext()).then(() => {
            client.on("interactionCreate", interaction => {
                if (interaction.customId === "mark-item") {
                    for (var task of this.tasks) {
                        if (task.task === interaction.values[0]) {
                            if (task.status_icon === STATUS.incomplete) task.status_icon = STATUS.complete;
                            else task.status_icon = STATUS.incomplete;
                            interaction.update(this.GetContext());
                        }
                    }
                }
            });
        })
    }

    constructor(name, icon_uri = null) {
        this.name = name;
        this.icon = icon_uri;
    }
}

module.exports = {
    Checklist,
    Task
}