// @ts-check

const OpenAi = require("openai");
const FileSystem = require("fs");
const Utils = require("../../include/Utils.js");

const OPENAI_CONFIG = new OpenAi.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_API = new OpenAi.OpenAIApi(OPENAI_CONFIG);

var text_settings = {
    model: "text-davinci-003",
    prompt: "",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0
};

async function Run(channel, tags, msg, self, client, args, args_with_case) {
    args_with_case.shift();
    text_settings.prompt = args_with_case.join(" ");

    try {
        var response = await OPENAI_API.createCompletion(text_settings);
        client.say(channel, response.data.choices[0].text)
        if (response.data.choices[0].text != "") client.say(channel, response.data.choices[0].text); else client.say(channel, "idk");
    } catch (e) {
        client.say(channel, `Status: ${e.response.status}, ${e.response.statusText}`)
    }

    console.log(`${Utils.GetTimeStamp()} [OpenAI] Begining of Response`);
    console.log(`${Utils.GetTimeStamp()} [OpenAI] Response: ${response.data.choices[0].text.replace("\n", "\\n")}`);
    console.log(`${Utils.GetTimeStamp()} [OpenAI] Response Finish Reason: ${response.data.choices[0].finish_reason}`);
    console.log(`${Utils.GetTimeStamp()} [OpenAI] End of Response`);

    return true;
}

module.exports = {
    NSFW: false,
    name: "OpenAI-TD3",
    category: global.COMMAND_CATEGORIES.FUN.NAME,
    aliases: [
        ["fa2"]
    ],
    Run
}