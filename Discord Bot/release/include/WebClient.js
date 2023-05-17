"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadFile = void 0;
const Axios = __importStar(require("axios"));
const FileSystem = __importStar(require("fs"));
const StreamPromises = __importStar(require("stream/promises"));
const Utility = __importStar(require("./Utility"));
const Path = __importStar(require("path"));
async function DownloadFile(url, file) {
    let wstream = FileSystem.createWriteStream(file);
    if (!FileSystem.existsSync(Path.dirname(file)))
        FileSystem.mkdirSync(Path.dirname(file), { recursive: true });
    let response = await Axios.default.get(url, { responseType: "stream" });
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Status Code: ${response.status}\x1b[0m`);
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Headers: ${JSON.stringify(response.headers, null, 2)}\x1b[0m`);
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Downloading ${file}\x1b[0m`);
    await StreamPromises.pipeline(response.data, wstream);
    wstream.close();
    console.log(`\x1b[36m${Utility.GenerateTimestamp()} [Download] Downloaded ${file}\x1b[0m`);
}
exports.DownloadFile = DownloadFile;
