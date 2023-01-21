// @ts-check
const FileSystem = require('fs');
const WebRequest = require('request');
const Utils = require('./Utils.js');

function DownloadFile(uri, filename, callback) {
    WebRequest.head(uri, function (err, res, body) {
        console.log(`${Utils.GetTimeStamp()} [Download] content-type:`, res.headers["content-type"]);
        console.log(`${Utils.GetTimeStamp()} [Download] content-length:`, res.headers["content-length"]);
        console.log(`${Utils.GetTimeStamp()} [Download] Downloaded ${filename}`);

        var dir = filename.split("/");
        dir.splice(-1, 1);
        dir = dir.join("/");

        if (!FileSystem.existsSync(dir)) FileSystem.mkdirSync(dir, { recursive: true });
        WebRequest(uri).pipe(FileSystem.createWriteStream(filename)).on("close", callback);
    });
};

async function DownloadFileAsync(uri, filename) {
    WebRequest.head(uri, async function (err, res, body) {
        console.log(`${Utils.GetTimeStamp()} [Download] content-type:`, res.headers["content-type"]);
        console.log(`${Utils.GetTimeStamp()} [Download] content-length:`, res.headers["content-length"]);
        console.log(`${Utils.GetTimeStamp()} [Download] Downloaded ${filename}`);

        var dir = filename.split("/");
        dir.splice(-1, 1);
        dir = dir.join("/");

        if (!FileSystem.existsSync(dir)) FileSystem.mkdirSync(dir, { recursive: true });
        await WebRequest(uri).pipe(FileSystem.createWriteStream(filename));
    });
};

module.exports = {
    DownloadFile,
    DownloadFileAsync
}