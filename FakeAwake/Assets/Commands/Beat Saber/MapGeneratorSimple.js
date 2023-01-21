const Discord = require("discord.js");
const Sharp = require("sharp");
const FileSystem = require("fs");
const zipper = require("zip-a-folder");
const Random = require("../../include/Random.js");
const WebClient = require("../../include/WebClient.js");
const Utils = require("../../include/Utils.js");

/* 
 * This is going to be an absolute mess
 * Letting FakeAwake make maps monka
 * PepeChrist
 */

class Note {
    _time = 0;
    _lineIndex = 0; // Lane
    _lineLayer = 0; // Row
    _type = 0;
    _cutDirection = 0;

    constructor(time, lane, row, type, cut_direction) {
        this._time = time;
        this._lineIndex = lane;
        this._lineLayer = row;
        this._type = type;
        this._cutDirection = cut_direction;
    }
}

function Run(message, args, args_with_case, client) {
    var MapInfo = {
        _version: "2.0.0",
        _songName: "x",
        _songSubName: "x",
        _songAuthorName: "x",
        _levelAuthorName: "FakeAwake",
        _beatsPerMinute: 0,
        _shuffle: 0,
        _shufflePeriod: 0.5,
        _previewStartTime: 12,
        _previewDuration: 10,
        _songFilename: "song.ogg",
        _coverImageFilename: "cover.jpg",
        _environmentName: "DefaultEnvironment",
        _songTimeOffset: 0,
        _customData: {
            _contributors: []
        },
        _difficultyBeatmapSets: [
            {
                _beatmapCharacteristicName: "Standard",
                _difficultyBeatmaps: [
                    {
                        _difficulty: "ExpertPlus",
                        _difficultyRank: 9,
                        _beatmapFilename: "ExpertPlusStandard.dat",
                        _noteJumpMovementSpeed: 17,
                        _noteJumpStartBeatOffset: -0.4000000059604645,
                        _customData: {
                            _editorOffset: 402,
                            _editorOldOffset: 402,
                            _warnings: [],
                            _information: [],
                            _suggestions: [],
                            _requirements: []
                        }
                    }
                ]
            }
        ]
    };

    var Map = {
        "_version": "2.0.0",
        "_BPMChanges": [],
        "_events": [],
        "_notes": []
    };

    var Duration = 0,
        BPM = 0,
        BeatDuration = 0,
        Offset = 0;

    if (message.attachments.size > 0 && args.length > 2) {
        for (var i = 0; i < args.length; i++) {
            switch (args[i]) {
                case "-bpm":
                    BPM = parseInt(args[i + 1]) || 0;
                    break;

                case "-duration":
                case "-dur":
                case "-time":
                case "-length":
                    Duration = parseFloat(args[i + 1]) || 0;
                    break;

                case "-offset":
                    Offset = parseFloat(args[i + 1]) || 0;
                    break;
            }
        }

        // Pre Download Audio Checks
        if (message.attachments.first().name.split(".")[1] === "ogg") {
            // Download ogg
            console.log(`${Utils.GetTimeStamp()} [Webclient] Downloading ${message.attachments.first().name} to ./Assets/temp/Mapping/song.ogg`);
            WebClient.DownloadFile(message.attachments.first().url, "./Assets/temp/Mapping/song.ogg", function () {
                console.log(`${Utils.GetTimeStamp()} [Webclient] Downloaded ${message.attachments.first().name} to ./Assets/temp/Mapping/song.ogg`);
                console.log(`${Utils.GetTimeStamp()} [Beat Saber Map Generator] Generating Map...`);

                if (Duration > 0 && BPM > 0) {
                    BeatDuration = 60 / BPM; // Calculate Duration of One Beat
                    var time = 0; // Starting Offset

                    // Mapping Info
                    MapInfo._beatsPerMinute = BPM;
                    // MapInfo._songTimeOffset = Offset;
                    MapInfo._difficultyBeatmapSets[0]._difficultyBeatmaps[0]._customData._editorOffset = Offset * 1000;
                    MapInfo._difficultyBeatmapSets[0]._difficultyBeatmaps[0]._customData._editorOldOffset = Offset * 1000;

                    // Mapping 
                    const DurationInBeats = Duration / 60 * BPM;
                    while (time < DurationInBeats) {
                        Map._notes.push(new Note(time, Random.RandInt(0, 4), Random.RandInt(0, 3), Random.RandInt(0, 2), Random.RandInt(0, 9)));
                        time++;
                    }

                    // Saving
                    console.log(`${Utils.GetTimeStamp()} [Beat Saber Map Generator] Writing Files...`);
                    FileSystem.writeFileSync("./Assets/temp/Mapping/ExpertPlusStandard.dat", JSON.stringify(Map, null, 4)); // Write Map
                    FileSystem.writeFileSync("./Assets/temp/Mapping/Info.dat", JSON.stringify(MapInfo, null, 4)); // Write Infos

                    // Zip and Send
                    zipper.zip("./Assets/temp/Mapping", "./Assets/temp/map.zip").finally(() => message.channel.send({ files: [new Discord.MessageAttachment("./Assets/temp/map.zip")] }));

                    console.log(`${Utils.GetTimeStamp()} [Beat Saber Map Generator] Mapping Complete`);
                } else {
                    message.reply("unspecified bpm and/or duration.")
                }
            });
        } else {
            message.reply("must be an ogg file.");
        }
    } else {
        message.reply("missing ogg file");
    }

    return true;
}

module.exports = {
    NSFW: false,
    name: "bsMapGeneratorSimple",
    category: global.COMMAND_CATEGORIES.BEAT_SABER.NAME,
    aliases: [
        [ "bs", "createmap" ],
        [ "bs", "makemap" ]
    ],
    Run
}