import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("고양이")
    .setDescription("랜덤 고양이 사진을 불러옵니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search", {
      headers: {
        "x-api-key": process.env.THE_CAT_API_KEY,
      },
    });

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage(response.data[0].url)
      .setTitle("🐱")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
