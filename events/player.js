const { Player } = require("discord-player");
const client = require("../index.js");
const ERROR = require("../commands/ERROR.js");

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("error", (queue, error) => {
  return queue.destroy();
});

player.on("connectionError", (queue, error) => {
  return queue.destroy();
});

module.exports = player;
