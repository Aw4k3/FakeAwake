import * as Http from "http";
import * as Utility from "./Utility.js";
import * as CommandHandler from "../src/CommandHandler.js";
import * as MessageChains from "../src/system/MessageChains.js";

let api: Http.Server;

export function Start() {
    api = Http.createServer(ApiRequestHandler);
    api.listen(4200, () => CommandHandler.Log(`Api is running on port 4200`));
}

function ApiRequestHandler(request: Http.IncomingMessage, response: Http.ServerResponse) {
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

function MapToString(map: Map<any, any>): string {
    return JSON.stringify(Object.fromEntries(map.entries()));
}