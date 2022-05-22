import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  ...new SlashCommandBuilder()
    .setName("핑")
    .setDescription("메시지 반응 속도를 확인합니다."),

  run: async (client: Client, interaction: CommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("🏓 퐁!")
      .setDescription(`반응 속도 : ${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
