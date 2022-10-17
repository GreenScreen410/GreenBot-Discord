import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("강아지")
    .setDescription("랜덤 강아지 사진을 불러옵니다."),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    let theDogAPIData: any = await axios({
      method: "GET",
      url: "https://api.thedogapi.com/v1/images/search",
      headers: {
        "x-api-key": process.env.THE_DOG_API_KEY,
      },
    });

    theDogAPIData = JSON.parse(JSON.stringify(theDogAPIData.data));

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage(`${theDogAPIData[0].url}`)
      .setTitle("🐶")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
