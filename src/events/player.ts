import { Player } from "discord-player";
import client from "../index";

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("error", (queue, error) => {
  console.log(error);
})

export default player;
