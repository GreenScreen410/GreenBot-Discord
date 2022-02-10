const { MessageEmbed } = require("discord.js");

module.exports = {
  INVAILD_INTERACTION: function (client, interaction, args) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("올바르지 않은 명령어입니다.")
      .addFields({ name: "에러 코드", value: "INVAILD_INTERACTION" })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_TYPE_ARGUMENTS: function (client, interaction, args) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("인자가 주어지지 않았습니다.")
      .addFields({ name: "에러 코드", value: "PLEASE_TYPE_ARGUMENTS" })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_JOIN_VOICE_CHANNEL: function (client, interaction, args) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("먼저 음성 채널에 접속해 주세요.")
      .addFields({ name: "에러 코드", value: "PLEASE_JOIN_VOICE_CHANNEL" })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },

  MUSIC_QUEUE_IS_EMPTY: function (client, interaction, args) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("재생중인 노래가 없습니다.")
      .addFields({ name: "에러 코드", value: "MUSIC_QUEUE_IS_EMPTY" })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },
};
