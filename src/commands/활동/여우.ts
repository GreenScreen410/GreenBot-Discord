import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

declare module "axios" {
  export interface AxiosResponse {
    image: string;
  }
}

export default {
  ...new SlashCommandBuilder()
    .setName("여우")
    .setDescription("랜덤 여우 사진을 불러옵니다."),

  run: async (client: Client, interaction: CommandInteraction) => {
    let theFoxAPIData = await axios.get("https://randomfox.ca/floof/");
    theFoxAPIData = JSON.parse(JSON.stringify(theFoxAPIData.data));

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(`${theFoxAPIData.image}`)
      .setTitle("🦊")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
