import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("투표")
    .setDescription("투표를 진행합니다.")
    .addStringOption(option => option
      .setName("설명")
      .setDescription("투표에 적을 설명을 입력해 주세요.")
      .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const description = interaction.options.getString("설명");

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("📊 투표")
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const message = await interaction.followUp({ embeds: [embed] });
    await message.react("✅");
    await message.react("❌");
  }
}