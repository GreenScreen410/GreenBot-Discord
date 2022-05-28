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
  ERROR.UNKNOWN_ERROR(client, queue.metadata);
  return queue.destroy();
});

player.on("connectionError", (queue, error) => {
  ERROR.CAN_NOT_JOIN_VOICE_CHANNEL(client, queue.metadata);
  return queue.destroy();
});

module.exports = player;
