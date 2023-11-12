import * as Http from "http";
import * as Utility from "./Utility.js";
import * as CommandHandler from "../src/CommandHandler.js";

var api: Http.Server;

export function Start() {
    api = Http.createServer(ApiRequestHandler);
    api.listen(4200, () => console.log(`${Utility.GenerateTimestamp()} Api is running on port 4200`));
}

function ApiRequestHandler(request: Http.IncomingMessage, response: Http.ServerResponse) {
    switch (request.url) {
        case "/commands":
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(Object.fromEntries(CommandHandler.GetCommands().entries())));
            break;

        default:
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("This is the FakeAwake discord bot API");
            break;
    }

    response.end();
}