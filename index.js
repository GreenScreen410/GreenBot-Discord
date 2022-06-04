require("dotenv").config();
const { Client, Collection } = require("discord.js");
const { KoreanbotsClient } = require("koreanbots");

const client = new KoreanbotsClient({
  intents: 32767,
  koreanbots: {
    api: {
      token: process.env.KOREANBOTS_TOKEN
    }
  }, koreanbotsClient: {
    updateInterval: 600000
  }
});
module.exports = client;

client.slashCommands = new Collection();

require("./handler")(client);

client.login(process.env.TOKEN);

process.on("uncaughtException", (error) => {
  console.log(error);
});
