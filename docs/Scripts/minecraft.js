const HOST = "mc.fakeawake.co.uk";
const SERVER_STATUS = document.getElementById("server-status");
const UPTIME = document.getElementById("uptime");
const ACTIVE_PLAYERS = document.getElementById("active-players");
const MAX_PLAYERS = document.getElementById("max-players");
const SERVER_VERSION = document.getElementById("server-version");
const BACKEND = document.getElementById("backend");
const MOTD_LINE_ONE = document.getElementById("motd1");
const MOTD_LINE_TWO = document.getElementById("motd2");
const PLAYERS = document.getElementById("player-cards");
let uptime = 0;

GetServerInfo();
GetPlayerInfo();

async function GetServerInfo() {
    try {
        let response = await fetch(`http://${HOST}:4567/v1/server`);
        let data = await response.json();
        SERVER_STATUS.innerHTML = "Server is up";
        ACTIVE_PLAYERS.innerHTML = data.onlinePlayers;
        MAX_PLAYERS.innerHTML = data.maxPlayers;
        BACKEND.innerHTML = data.name;
        SERVER_VERSION.innerHTML = data.version.match(/[0-9]+\.[0-9]+\.[0-9]/)[0];
        let motd = data.motd.split("\n");
        MOTD_LINE_ONE.innerHTML = motd[0];
        MOTD_LINE_TWO.innerHTML = motd[1];
        uptime = data.health.uptime;
        setInterval(() => {
            uptime++;
            let s = uptime % 60;
            let m = Math.floor(uptime / 60) % 60;
            let h = Math.floor(uptime / 3600);
            UPTIME.innerHTML = PadZero(h) + ':' + PadZero(m) + ':' + PadZero(s);
        }, 1000);
    } catch (error) {
        SERVER_STATUS.innerHTML = `Server is down <span class="material-symbols-outlined" id="visibility-icon" style="font-size: 60%">cloud_off</span>`;
        console.log(error);
        return;
    }


}

async function GetPlayerInfo() {
    try {
        let response = await fetch(`http://${HOST}:4567/v1/players`);
        let data = await response.json();
        for (let player of data) {
            PLAYERS.innerHTML += `<div class="player-card"><img src="https://mc-heads.net/avatar/${player.uuid}" alt="player-icon"></div>`
            // <p>${player.displayName}</p>
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

function PadZero(n) {
    return (n < 10 ? '0' : '') + n;
}

function FormatMotd(s) {
    let ss = s.split("$")
}