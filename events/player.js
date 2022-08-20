const { Player } = require("discord-player");
const client = require("../index.js");

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("error", (queue, error) => {
  console.log(error);
  return queue.destroy(1);
});

player.on("connectionError", (queue, error) => {
  console.log(error);
  return queue.destroy(1);
});

player.on("botDisconnected", () => {
  return queue.destroy(1);
});

module.exports = player;
