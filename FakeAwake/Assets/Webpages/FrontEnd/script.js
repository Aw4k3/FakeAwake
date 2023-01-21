const Electron = require("electron");

function CreateWindow() {
    const WIN = new Electron.BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    WIN.loadFile("index.html");
    // WIN.webContents.openDevTools();
    WIN.webContents.send("change-text", "Ludicin - Fallen Symphony");
}

Electron.app.whenReady().then(() => CreateWindow());