import * as Axios from "axios";
import * as FileSystem from "fs";
import * as StreamPromises from "stream/promises";
import * as Utility from "./Utility";
import * as Path from "path";

export async function DownloadFile(url: string, file: string): Promise<void> {
    let wstream = FileSystem.createWriteStream(file);

    if (!FileSystem.existsSync(Path.dirname(file))) FileSystem.mkdirSync(Path.dirname(file), { recursive: true });
    let response: Axios.AxiosResponse = await Axios.default.get(url, { responseType: "stream" });
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Status Code: ${response.status}\x1b[0m`);
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Headers: ${JSON.stringify(response.headers, null, 2)}\x1b[0m`);
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Downloading ${file}\x1b[0m`);
    await StreamPromises.pipeline(response.data, wstream);
    wstream.close();
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Downloaded ${file}\x1b[0m`);
}