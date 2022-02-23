require("dotenv").config();
const { VoiceClient } = require("djs-voice");
const client = require("../index")
const mongo = process.env.mongooseConnectionString

const voiceClient = new VoiceClient({
    allowBots: false,
    client: client,
    debug: true,
    mongooseConnectionString: mongo,
});

client.on("voiceStateUpdate", (oldState, newState) => {
    voiceClient.startListener(oldState, newState);
})

module.exports = voiceClient;