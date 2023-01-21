const FileSystem = require('fs');

function AddToTrainingData(message, lastmsg) {
    var jObject = JSON.parse(FileSystem.readFileSync('./Assets/Data/AI and ML/Conversation/TrainingData.js'));
    jObject = `{ "input": "${message.cleanContent}", "output": "${lastmsg.cleanContent}" }`;
    //console.log(jObject);
}

module.exports = {
    AddToTrainingData
}