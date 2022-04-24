require("dotenv").config();
const express = require('express');
const server = express();
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

server.all(`/`, (req, res) => {
  res.send(`Result: [OK].`);
});

function keepAlive() {
  server.listen(3000, () => {
    console.log(`Server is now ready! | ` + Date.now());
  });
}

keepAlive();
client.login(process.env.TOKEN);