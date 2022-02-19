const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "핑",
  description: "반응 속도를 반환합니다.",
  type: "CHAT_INPUT",

  run: async (client, interaction, args) => {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("🏓 퐁!")
      .setDescription(`반응 속도 : ${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },
};
