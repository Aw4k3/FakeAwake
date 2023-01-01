// @ts-check

const Discord = require("discord.js");
const Status = require("../../include/Status.js");
const Utils = require("../../include/Utils.js");
const Sharp = require("sharp");
const Vector = require("three");
const Chroma = require("chroma-js");
const WebClient = require("../../include/WebClient.js");
const FileSystem = require("fs");

const ICON = new Discord.MessageAttachment("./Assets/Images/PaintPalette.png")
const COLOUR_SPACES = ["srgb", "rgb", "cymk", "lab", "bw"];
var editLogEmbed = new Discord.MessageEmbed()
    .setTitle("Successfully edited image")
    .setColor(Status.StatusColor("OK"))
    .setThumbnail("attachment://PaintPalette.png")
    .setFooter("Image Tools");

const OPERATIONS = {
    RESIZE: 0,
    COLOUR_SPACE: 1,
    GRAYSCALE: 2,
    HUE_SHIFT: 3,
    SET_SATURATION: 4,
    SET_BRIGHTNESS: 5,
    TINT: 6,
    BLUR: 7,
    HORIZTONAL_FLIP: 8,
    VERTICAL_FLIP: 9,
    ROTATE: 10,
    SHARPEN: 11,
    THRESHOLD: 12,
    TO_PNG: 13
}

class Operation {
    operation = -1;
    data = {};

    constructor(operation, data) {
        this.operation = operation;
        this.data = data;
    }
}

class Editor {
    image = Sharp();
    success = false;
    errors = [];
    operation_queue = [];
    operation_log = [];

    async ResolveOperations(args) {
        for (var i = 0; i < args.length; i++) {
            switch (args[i]) {
                case "-res":
                case "-resize":
                case "-resolution":
                    {
                        if (!args[i + 1] && !args[i + 2]) {
                            this.errors.push("Invalid Resolution! Expected <int:width> <int:height>");
                            return;
                        }

                        let temp = new Vector.Vector2(parseInt(args[i + 1]) || 0, parseInt(args[i + 2]) || 0);

                        if (temp.x == 0 || temp.y == 0) {
                            this.errors.push("Invalid Resolution! Expected <int:width> <int:height>");
                            return;
                        }

                        this.operation_queue.push(new Operation(OPERATIONS.RESIZE, { width: temp.x, height: temp.y }));
                    }
                    break;

                case "-colourspace":
                case "-colorspace":
                case "-cs":
                    if (!args[i + 1]) {
                        this.errors.push(`Invalid Colour Space! Expected <string:colourspace>\nPossible colour spaces [${COLOUR_SPACES.join(", ")}]`);
                        return;
                    }

                    if (!COLOUR_SPACES.includes(args[i + 1])) {
                        this.errors.push(`Invalid Colour Space! Expected <string:colourspace>\nPossible colour spaces [${COLOUR_SPACES.join(", ")}]`);
                        return;
                    }

                    this.operation_queue.push(new Operation(OPERATIONS.COLOUR_SPACE, { value: args[i + 1] }));

                    break;

                case "-grayscale":
                case "-greyscale":
                    this.operation_queue.push(new Operation(OPERATIONS.GRAYSCALE, {}));
                    break;

                case "-hue":
                case "-hueshift":
                case "-hs":
                    {
                        if (!args[i + 1]) {
                            this.errors.push(`Invalid Value! Expected <float:value>`);
                            return;
                        }

                        let temp = parseFloat(args[i + 1]) || 0;

                        this.operation_queue.push(new Operation(OPERATIONS.HUE_SHIFT, { value: temp }));
                    }
                    break;

                case "-sat":
                case "-saturation":
                    {
                        if (!args[i + 1]) {
                            this.errors.push(`Invalid Value! Expected <float:value>`);
                            return;
                        }

                        let temp = parseFloat(args[i + 1]) || 0;

                        this.operation_queue.push(new Operation(OPERATIONS.SET_SATURATION, { value: temp }));
                    }
                    break;

                case "-bright":
                case "-brightness":
                    {
                        if (!args[i + 1]) {
                            this.errors.push(`Invalid Value! Expected <float:value>`);
                            return;
                        }

                        let temp = parseFloat(args[i + 1]) || 0;

                        this.operation_queue.push(new Operation(OPERATIONS.SET_BRIGHTNESS, { value: temp }));
                    }
                    break;

                case "-tint":
                    {
                        if (!args[i + 1] && !args[i + 2] && !args[i + 2]) {
                            this.errors.push(`Invalid Value! Expected <int:red> <int:blue> <int:green>`);
                            return;
                        }

                        let temp = new Vector.Vector3(parseInt(args[i + 1]) || -1, parseInt(args[i + 2]) || -1, parseInt(args[i + 3]) || -1);
                        if (temp.x < 0 || temp.y < 0 || temp.z < 0) {
                            this.errors.push(`Invalid Value! Expected <int:red> <int:blue> <int:green>`);
                            return
                        }

                        temp.clamp(new Vector.Vector3(0, 0, 0), new Vector.Vector3(255, 255, 255));

                        this.operation_queue.push(new Operation(OPERATIONS.SET_BRIGHTNESS, { value: temp }));
                    }
                    break;

                case "-flip":
                case "-horizontalflip":
                    this.operation_queue.push(new Operation(OPERATIONS.HORIZTONAL_FLIP, {}));
                    break;

                case "-flop":
                case "-verticalflip":
                    this.operation_queue.push(new Operation(OPERATIONS.VERTICAL_FLIP, {}));
                    break;

                case "-rot":
                case "-rotate":
                    {
                        if (!args[i + 1]) {
                            this.errors.push(`Invalid Value! Expected <float:degrees>`);
                            return;
                        }

                        let temp = parseFloat(args[i + 1]) || 0;

                        this.operation_queue.push(new Operation(OPERATIONS.ROTATE, { value: temp }));
                    }
                    break;

                case "-sharpen":
                    {
                        if (!args[i + 1]) {
                            this.errors.push(`Invalid Value! Expected <float:value>`);
                            return;
                        }

                        let temp = parseFloat(args[i + 1]) || 0;

                        this.operation_queue.push(new Operation(OPERATIONS.SHARPEN, { value: temp }));
                    }
                    break;

                case "-threshold":
                case "-th":
                    {
                        if (!args[i + 1]) {
                            this.errors.push(`Invalid Value! Expected <float:value>`);
                            return;
                        }

                        let temp = parseFloat(args[i + 1]) || 0;
                        temp = Utils.Clamp(temp, 0, 255);

                        this.operation_queue.push(new Operation(OPERATIONS.THRESHOLD, { value: temp }));
                    }
                    break;
            }
        }
    }

    async Run() {
        if (this.operation_queue.length < 1) return;

        for (var i = 0; i < this.operation_queue.length; i++) {
            switch (this.operation_queue[i].operation) {
                case OPERATIONS.RESIZE:
                    await this.image.resize(this.operation_queue[i].data.width, this.operation_queue[i].data.height, { fit: "fill" });
                    this.operation_log.push(`Resized - ${this.operation_queue[i].data.width}x${this.operation_queue[i].data.height}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Resized - ${this.operation_queue[i].data.width}x${this.operation_queue[i].data.height}`);
                    break;

                case OPERATIONS.COLOUR_SPACE:
                    await this.image.toColourspace(this.operation_queue[i].data.width);
                    this.operation_log.push(`Colourspace set to ${this.operation_queue[i].data.width}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Colourspace set to ${this.operation_queue[i].data.width}`);
                    break;

                case OPERATIONS.GRAYSCALE:
                    await this.image.grayscale();
                    this.operation_log.push(`Grayscaled`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Grayscaled`);
                    break;

                case OPERATIONS.HUE_SHIFT:
                    await this.image.modulate({ hue: this.operation_queue[i].data.value });
                    this.operation_log.push(`Hue shifted: ${this.operation_queue[i].data.value} degrees`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Hue shifted: ${this.operation_queue[i].data.value} degrees`);
                    break;

                case OPERATIONS.SET_SATURATION:
                    await this.image.modulate({ saturation: this.operation_queue[i].data.value });
                    this.operation_log.push(`Set Saturation: ${this.operation_queue[i].data.value}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Set Saturation: ${this.operation_queue[i].data.value}`);
                    break;

                case OPERATIONS.SET_BRIGHTNESS:
                    await this.image.modulate({ brightness: this.operation_queue[i].data.value });
                    this.operation_log.push(`Set Brightness: ${this.operation_queue[i].data.value}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Set Brightness: ${this.operation_queue[i].data.value}`);
                    break;

                case OPERATIONS.TINT:
                    let _temp = this.operation_queue[i].data.value;
                    await this.image.tint(new Chroma(_temp.x, _temp.y, _temp.z));
                    this.operation_log.push(`Tint Applied - R: ${_temp.x} G: ${_temp.y} B: ${_temp.z}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Tint Applied - R: ${_temp.x} G: ${_temp.y} B: ${_temp.z}`);
                    break;

                case OPERATIONS.BLUR:
                    await this.image.blur(this.operation_queue[i].data.value);
                    this.operation_log.push(`Blurred: ${this.operation_queue[i].data.value} Radius`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Blurred: ${this.operation_queue[i].data.value} Radius`);
                    break;

                case OPERATIONS.HORIZTONAL_FLIP:
                    await this.image.flop();
                    this.operation_log.push(`Horizontally Flipped`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Horizontally Flipped`);
                    break;

                case OPERATIONS.VERTICAL_FLIP:
                    await this.image.flip();
                    this.operation_log.push(`Vertically Flipped`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Vertically Flipped`);
                    break;

                case OPERATIONS.ROTATE:
                    await this.image.rotate(this.operation_queue[i].data.value);
                    this.operation_log.push(`Rotated: ${this.operation_queue[i].data.value} degrees`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Rotated: ${this.operation_queue[i].data.value} degrees`);
                    break;

                case OPERATIONS.SHARPEN:
                    await this.image.sharpen(this.operation_queue[i].data.value);
                    this.operation_log.push(`Sharpened: ${this.operation_queue[i].data.value}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Sharpened: ${this.operation_queue[i].data.value}`);
                    break;

                case OPERATIONS.THRESHOLD:
                    await this.image.threshold(this.operation_queue[i].data.value);
                    this.operation_log.push(`Threshold: ${this.operation_queue[i].data.value}`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Threshold: ${this.operation_queue[i].data.value}`);
                    break;

                case OPERATIONS.TO_PNG:
                    this.operation_log.push(`Format: PNG`);
                    console.log(`${Utils.GetTimeStamp()} [ImageTools] Format: PNG`);
                    break;
            }
        }
    }

    async Save() {
        await this.image.png();
        await this.image.toFile("./Assets/temp/editedImage.png");
    }

    OneShot(operation, message, start_time) {
        this.operation_queue.push(operation);
        this.Run();
        this.Save();

        var fileSize = FileSystem.statSync("./Assets/temp/editedImage.png").size;
        editLogEmbed.addField("Processing Time", `${Date.now() - start_time}ms`, true);
        editLogEmbed.addField("Filesize", `${Math.round(fileSize * 100 / 1024 / 1024) / 100}MB`, true);
        editLogEmbed.setDescription(this.operation_log.join("\n"));

        if (fileSize > 8 * 1024 * 1024) {
            message.channel.send(editLogEmbed
                .addField("Result file size too large", `File was ${Math.round(fileSize * 100 / 1024 / 1024) / 100}/8MB`)
                .setColor(Status.StatusColor("ERROR"))
            );
        } else {
            //Send Image
            message.channel.send({ embeds: [editLogEmbed], files: [ICON] });
            message.channel.send({ files: [new Discord.MessageAttachment("./Assets/temp/editedImage.png")] });
            console.log(`${Utils.GetTimeStamp()} [Upload] Uploaded "./Assets/temp/editedImage.png"`);
        }

        editLogEmbed.fields = [];
    }

    constructor(path) {
        this.image = Sharp(path);
    }
}

function Run(message, args, args_with_case, client) {
    if (message.attachments.size > 0) { // Where any options specified along with an attached image?
        
        /* Download Image */
        var fileExtension = message.attachments.first().name.split(".")[1];
        var StartTime = Date.now();

        editLogEmbed.setDescription("No operations executed");

        WebClient.DownloadFile(message.attachments.first().url, `./Assets/temp/uneditedImage.${fileExtension}`, async () => {
            var editor = new Editor(`./Assets/temp/uneditedImage.${fileExtension}`);
            switch (args[0]) {
                case "png":
                    editor.OneShot(new Operation(OPERATIONS.TO_PNG, {}), message, StartTime);
                    return;

                case "hueshift":
                    editor.OneShot(new Operation(OPERATIONS.HUE_SHIFT, { value: parseFloat(args[1]) || 0 }), message, StartTime);
                    return;
            }

            await editor.ResolveOperations(args);
            await editor.Run();
            await editor.Save();

            var fileSize = FileSystem.statSync("./Assets/temp/editedImage.png").size;
            editLogEmbed.addField("Processing Time", `${Date.now() - StartTime}ms`);
            editLogEmbed.addField("Filesize", `${Math.round(fileSize * 100 / 1024 / 1024) / 100}MB`);
            editLogEmbed.setDescription(editor.operation_log.join("\n"));

            if (fileSize > 8 * 1024 * 1024) {
                message.channel.send(editLogEmbed
                    .addField("Result file size too large", `File was ${Math.round(fileSize * 100 / 1024 / 1024) / 100}/8MB`)
                    .setColor(Status.StatusColor("ERROR"))
                );
            } else {
                //Send Image
                message.channel.send({ embeds: [editLogEmbed], files: [ICON] });
                message.channel.send({ files: [new Discord.MessageAttachment("./Assets/temp/editedImage.png")] });
                console.log(`${Utils.GetTimeStamp()} [Upload] Uploaded "./Assets/temp/editedImage.png"`);
            }

            editLogEmbed.fields = [];
        });
    } else {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Help > Image Tools > Edit")
                    .setColor(Status.StatusColor("ERROR"))
                    .addFields(
                        { name: "Bracket Definitions", value: "{Required} [optional]" },
                        { name: ".it [flag] [flag] [flag]...", value: "Apply slight tweaks to a provided image" },
                        { name: "Generic Flags", value: "`-resize`" },
                        { name: "Color Manipulation Flags", value: "`-brightness` `-colorspace` `-grayscale` `-hueshift` `-saturation` `-tint`" },
                        { name: "Image Operation Flags", value: "`-blur` `-flip` `-flop` `-rotate` `-sharpen` `-threshhold`" },
                        { name: "Available COLOR_SPACES", value: "`srgb` `rgb` `cymk` `lab` `bw`" }
                    )
                    .setThumbnail("attachment://PaintPalette.png")
                    .setFooter(Status.InvalidCommandMessage())
            ]
        });
    }

    return true;
}

/*************** Main ***************/
module.exports = {
    NSFW: false,
    name: "edit",
    category: global.COMMAND_CATEGORIES.UTILITY.NAME,
    aliases: [
        ["it"],
        ["imagetools"],
        ["png"],
        ["hueshift"]
    ],
    Run
}