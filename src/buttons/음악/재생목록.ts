import { Client, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import MusicQueue from "../../commands/음악/재생목록.js";

export default {
  data: new ButtonBuilder()
    .setCustomId("MusicQueueButton")
    .setLabel("재생목록")
    .setEmoji("📄")
    .setStyle(ButtonStyle.Secondary),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    MusicQueue.run(client, interaction);
  }
};
