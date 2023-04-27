import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("여우")
    .setDescription("랜덤 여우 사진을 불러옵니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    const response = await axios.get("https://randomfox.ca/floof/");

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage(response.data.image)
      .setTitle("🦊")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
