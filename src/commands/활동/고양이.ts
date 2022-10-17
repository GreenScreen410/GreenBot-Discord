import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("고양이")
    .setDescription("랜덤 고양이 사진을 불러옵니다."),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    let theCatAPIData: any = await axios({
      method: "GET",
      url: "https://api.thecatapi.com/v1/images/search",
      headers: {
        "x-api-key": process.env.THE_CAT_API_KEY,
      },
    });

    theCatAPIData = JSON.parse(JSON.stringify(theCatAPIData.data));

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage(`${theCatAPIData[0].url}`)
      .setTitle("🐱")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
