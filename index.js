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

// Global Variables
// client.commands = new Collection();
client.slashCommands = new Collection();

// Initializing the project
require("./handler")(client);

client.login(process.env.TOKEN);
