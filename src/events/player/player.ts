import { Player } from "discord-player";
import chalk from "chalk";
import client from "../../index.js";

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("error", (queue, error) => {
  console.log(chalk.red.bold(`[PLAYER_ERROR] ${error.stack}`));
  return queue.destroy();
});

player.on("connectionError", (queue, error) => {
  console.log(chalk.red.bold(`[PLAYER_CONNECTION_ERROR] ${error.stack}`));
  return queue.destroy();
});

export default player;