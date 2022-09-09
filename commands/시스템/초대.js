const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("초대")
    .setDescription("봇 초대 링크를 발급합니다."),

  run: async (client, interaction) => {
    const link = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=277028653056&scope=bot%20applications.commands`

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("💌 봇을 초대해보세요!")
      .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription(`현재 ${client.guilds.cache.size}개의 서버, ${client.users.cache.size}명의 유저들이 사용하고 있답니다!\n\n${link}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  }
}