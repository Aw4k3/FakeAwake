const Electron = require("electron");

function CreateWindow() {
    const WINDOW = new Electron.BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });

    WINDOW.loadFile("UI/index.html");
}

Electron.app.on("ready", () => {
    CreateWindow();
});