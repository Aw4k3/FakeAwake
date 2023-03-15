const CHAMPION_DROPDOWN = document.getElementById("champion-dropdown");
const CHAMPION_IMAGE = document.getElementById("champion-image");
var database = null;

Init();

async function Init() {
    var response = await fetch("../Assets/Apex Randomiser/Database.json");
    database = await response.json();

    for (let champion in database["champions"]) {
        CHAMPION_DROPDOWN.options[CHAMPION_DROPDOWN.options.length] = new Option(CapitaliseFirstLetter(champion), champion);
    }

    CHAMPION_DROPDOWN.addEventListener("change", OnChampionSelect);
    document.getElementById("randomise-champion").addEventListener("click", RandomiseChampion)
    RandomiseChampion();
}

function OnChampionSelect() {
    CHAMPION_IMAGE.src = database["champions"][CHAMPION_DROPDOWN.value]["portrait"];
}

function RandomiseChampion() {
    CHAMPION_DROPDOWN.selectedIndex = RandInt(0, CHAMPION_DROPDOWN.options.length - 1);
    OnChampionSelect();
}

function RandInt(min, max) {
    max++;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function CapitaliseFirstLetter(s) {
    if (s.length < 0) return;
    return s[0].toUpperCase() + s.substring(1);
}