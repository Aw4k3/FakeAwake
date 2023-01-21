const FileSystem = require('fs');

const CONFIG_PATH = './Assets/Data/GuildConfigs.json';

const PROPERTIES = {
    PREFIX: "Prefix",
    BOT_CHANNELS: "Bot Channels",
    BROADCAST_CHANNEL: "Broadcast Channel",
    SFW: "SFW",
    RULES: "Rules",
    SOUNDBOARD: "Soundboard"
};

function GetProperty(guild_id, property) {
    var config = JSON.parse(FileSystem.readFileSync(CONFIG_PATH));
    if (!Object.keys(config).includes(guild_id)) return null;
    if (!Object.keys(config[guild_id]).includes(property)) return null;
    return config[guild_id][property];
}

function set_property(guild, property, value) {
    var config = JSON.parse(FileSystem.readFileSync(CONFIG_PATH));

    if (Object.values(PROPERTIES).includes(property)) {
        if (!Object.keys(config).includes(guild.id)) { // If guild doesn't have an entry
            config[guild.id] = {}; // Create entry for guild
        }

        if (value !== undefined) { // If a value was provided
            switch (property) {
                case PROPERTIES.PREFIX:
                    config[guild.id][property] = value;
                    break;

                case PROPERTIES.BOT_CHANNELS:
                    if (!Object.keys(config[guild.id]).includes(property)) {
                        config[guild.id][property] = [];
                    }

                    for (var i = 0; i < value.length; i++) {
                        config[guild.id][property].push(value[i].id);
                    }

                    break;

                case PROPERTIES.BROADCAST_CHANNEL:
                    config[guild.id][property] = value.id;
                    break;

                case PROPERTIES.SFW:
                    config[guild.id][property] = value;
                    break;

                case PROPERTIES.RULES:
                    if (!Object.keys(config[guild.id]).includes(property)) {
                        config[guild.id][property] = [];
                    }

                    config[guild.id][property] = value;
                    break;

                case PROPERTIES.SOUNDBOARD:
                    if (!Object.keys(config[guild.id]).includes(property)) {
                        config[guild.id][property] = [];
                    }

                    config[guild.id][property] = value;
                    break;
            }
            FileSystem.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        } else { // If no value was provided
            remove_property(guild, property);
        }
    }
}

function remove_property(guild, property) {
    // Remove property
    var config = JSON.parse(FileSystem.readFileSync(CONFIG_PATH));
    if (Object.keys(config).includes(guild.id)) {
        if (Object.keys(config[guild.id]).includes(property)) {
            delete config[guild.id][property];
        }
    }
    
    // Clean up
    if (Object.keys(config).includes(guild.id)) {
        if (Object.keys(config[guild.id]).length === 0) {
            delete config[guild.id];
        }
    }
    
    // Write config file
    FileSystem.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function read_config() { return JSON.parse(FileSystem.readFileSync(CONFIG_PATH)); }

module.exports = {
    CONFIG_PATH,
    PROPERTIES,
    set_property,
    GetProperty,
    remove_property,
    read_config
}