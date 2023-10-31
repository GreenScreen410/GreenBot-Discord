import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("가동시간")
    .setDescription("봇의 가동 시간을 확인합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    let totalSeconds = (interaction.client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🕘 가동 시간")
      .setDescription(`${days}일 ${hours}시간  ${minutes}분 ${seconds}초`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });

    if (totalSeconds >= 10080) {
      interaction.client.achievements.GRANT(interaction, "uptime_1");

      if (totalSeconds >= 20160) {
        interaction.client.achievements.GRANT(interaction, "uptime_2");
      }
    }
  }
}