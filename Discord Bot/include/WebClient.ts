import * as FileSystem from "fs";
import * as Https from "https";
import * as Utility from "Utility.js";

export async function DownloadFileAsync(url: string, file: string): Promise<void> {
    let wstream = FileSystem.createWriteStream(file);
    Https.get(url, response => {
        console.log(`\x1b[34m${Utility.GenerateTimestamp()} [Download] Status Code: ${response.statusCode}`);
        console.log(`\x1b[34m${Utility.GenerateTimestamp()} [Download] Headers: ${response.headers}`);
        console.log(`\x1b[34m${Utility.GenerateTimestamp()} [Download] Downloaded ${file}`);
        response.pipe(wstream);
        wstream.on("finish", () => {
            wstream.close();
            console.log(`\x1b[34m${Utility.GenerateTimestamp()} [Download] Downloaded and Saved ${file}\x1b[0m`);
        });
    });
}