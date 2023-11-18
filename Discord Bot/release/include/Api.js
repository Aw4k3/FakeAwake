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
exports.Start = void 0;
const Http = __importStar(require("http"));
const Utility = __importStar(require("./Utility.js"));
const CommandHandler = __importStar(require("../src/CommandHandler.js"));
const MessageChains = __importStar(require("../src/system/MessageChains.js"));
var api;
function Start() {
    api = Http.createServer(ApiRequestHandler);
    api.listen(4200, () => console.log(`${Utility.GenerateTimestamp()} Api is running on port 4200`));
}
exports.Start = Start;
function ApiRequestHandler(request, response) {
    switch (request.url) {
        case "/commands":
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(MapToString(CommandHandler.GetCommands()));
            break;
        case "/message_chains":
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(MapToString(MessageChains.GetChains()));
            break;
        default:
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("This is the FakeAwake discord bot API");
            break;
    }
    response.end();
}
function MapToString(map) {
    return JSON.stringify(Object.fromEntries(map.entries()));
}
