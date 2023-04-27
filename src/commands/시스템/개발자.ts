import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("개발자")
    .setDescription("개발자에 대한 정보를 출력합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("📘 개발자 정보")
      .addFields(
        { name: "👑 이름", value: "그린스크린", inline: true },
        { name: "🏷 디스코드 태그", value: "<@332840377763758082>", inline: true },
        { name: "🌐 웹사이트", value: "https://github.com/GreenScreen410", inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
