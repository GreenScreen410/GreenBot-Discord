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
})

module.exports = player;
