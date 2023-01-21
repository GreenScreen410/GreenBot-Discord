import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("차단")
    .setDescription("[관리자] 유저의 봇 사용 권한을 막습니다.")
    .addUserOption((option) => option
      .setName("유저")
      .setDescription("유저를 선택해 주세요.")
      .setRequired(true))
    .addBooleanOption((option) => option
      .setName("설정")
      .setDescription("옵션을 선택해 주세요.")
      .setRequired(true)
    ),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser("유저");
    const boolean = interaction.options.getBoolean("설정");

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("💌 봇을 초대해보세요!")
      .setDescription(`현재 ${client.guilds.cache.size}개의 서버, ${client.users.cache.size}명의 유저들이 사용하고 있습니다.\n(버튼에 마우스 오른쪽 클릭을 하면 초대 링크를 복사하실 수 있습니다.)`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  }
}