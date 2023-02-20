const FileSystem = require('fs');

const StatsFilePath = './Assets/Data/UserStats.json';
const STATS = {
    HUGS_GIVEN: "HugsGiven",
    HUGS_RECEIVED: 'HugsReceived',
    BONKS_GIVEN: 'BonksGiven',
    BONKS_RECEIVED: 'BonksReceived',
    WEEWOOS_GIVEN: "WeeWoosGiven",
    WEEWOOS_RECEIVED: "WeeWoosReceived"

}
const AvailableStats = [
    'HugsGiven',
    'HugsReceived',
    'BonksGiven',
    'BonksReceived'
]

function LogUserStat(User, Stat, SubUser) {
    // if (AvailableStats.includes(Stat)) {
    if (Object.values(STATS).includes(Stat)) {
        if (VerifyUser(User, Stat)) {
            UserStats = JSON.parse(FileSystem.readFileSync(StatsFilePath));

            if (!Object.keys(UserStats[User.id][Stat]).includes(SubUser.id)) {
                UserStats[User.id][Stat][SubUser.id] = 1;
            } else {
                UserStats[User.id][Stat][SubUser.id] = parseInt(UserStats[User.id][Stat][SubUser.id]) + 1;
            }

            FileSystem.writeFileSync(StatsFilePath, JSON.stringify(UserStats, null, 2));
        }
    }
}

function VerifyUser(User, LogParameter) {
    var Exists = true;
    UserStats = JSON.parse(FileSystem.readFileSync(StatsFilePath));

    // if (!UserStats.hasOwnProperty(User.id)) {
    if (!Object.keys(UserStats).includes(User.id)) {
        UserStats[User.id] = {};
        UserStats[User.id]["User"] = User.tag;
        UserStats[User.id][LogParameter] = {};
        Exists = false;
    } else {
        // if (!UserStats[User.id].hasOwnProperty(LogParameter)) {
        if (!Object.keys(UserStats[User.id]).includes(LogParameter)) {
            UserStats[User.id][LogParameter] = {};
        }
    }

    FileSystem.writeFileSync(StatsFilePath, JSON.stringify(UserStats, null, 2));

    return Exists;
}

module.exports = {
    LogUserStat,
    AvailableStats,
    StatsFilePath,
    STATS
}