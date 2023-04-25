import * as FileSystem from "fs";
import * as Https from "https";
import * as Utils from "./Utils";

export async function DownloadFileAsync(url: string, file: string): Promise<void> {
    let wstream = FileSystem.createWriteStream(file);
    Https.get(url, response => {
        console.log(`${Utils.GetTimeStamp()} [Download] Status Code: ${response.statusCode}`);
        console.log(`${Utils.GetTimeStamp()} [Download] Headers: ${response.headers}`);
        console.log(`${Utils.GetTimeStamp()} [Download] Downloaded ${file}`);
        response.pipe(wstream);
        wstream.on("finish", () => {
            wstream.close();
            console.log(`${Utils.GetTimeStamp()} [Download Manager] Downloaded and Saved ${file}`);
        });
    });
}