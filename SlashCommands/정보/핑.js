const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("핑")
    .setDescription("반응 속도를 반환합니다."),

  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("🏓 퐁!")
      .setDescription(`반응 속도 : ${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
