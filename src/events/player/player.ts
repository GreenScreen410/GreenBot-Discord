import { Player } from "discord-player";
import client from "../../index.js";

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("error", (queue, error) => {
  console.log(error);
  return queue.destroy(true);
});

player.on("connectionError", (queue, error) => {
  console.log(error);
  return queue.destroy(true);
});

player.on("botDisconnect", (queue) => {
  return queue.destroy(true);
});

export default player;