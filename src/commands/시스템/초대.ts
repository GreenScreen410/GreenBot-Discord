import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import InviteButton from "../../buttons/링크/초대.js";

export default {
  data: new SlashCommandBuilder()
    .setName("초대")
    .setDescription("봇 초대 링크를 발급합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(InviteButton.data)
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("💌 봇을 초대해보세요!")
      .setDescription(`현재 ${interaction.client.guilds.cache.size}개의 서버, ${interaction.client.users.cache.size}명의 유저들이 사용하고 있습니다.\n(버튼에 마우스 오른쪽 클릭을 하면 초대 링크를 복사하실 수 있습니다.)`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed], components: [button] });
  }
}