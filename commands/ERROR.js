const { MessageEmbed } = require("discord.js");

const embed = new MessageEmbed()
  .setColor("#FF0000")
  .setTitle("❌ 오류!")

module.exports = {
  UNKNOWN_ERROR: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("알 수 없는 오류가 발생하였습니다.")
      .addFields({ name: "에러 코드", value: "UNKNOWN_ERROR" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  INVALID_INTERACTION: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("올바르지 않은 명령어입니다.")
      .addFields({ name: "에러 코드", value: "INVALID_INTERACTION" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_TYPE_ARGUMENTS: function (client, interaction) {
      embed.setDescription("인자가 주어지지 않았습니다.")
      embed.ddFields({ name: "에러 코드", value: "PLEASE_TYPE_ARGUMENTS" })
      embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  INVALID_ARGUMENT: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("잘못된 인자입니다.")
      .addFields({ name: "에러 코드", value: "INVALID_ARGUMENT" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_JOIN_VOICE_CHANNEL: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("먼저 음성 채널에 접속해 주세요.")
      .addFields({ name: "에러 코드", value: "PLEASE_JOIN_VOICE_CHANNEL" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_JOIN_SAME_VOICE_CHANNEL: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("같은 음성 채널에 접속해 주세요.")
      .addFields({ name: "에러 코드", value: "PLEASE_JOIN_SAME_VOICE_CHANNEL" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  CAN_NOT_JOIN_VOICE_CHANNEL: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("음성 채널에 접속할 수 없습니다.")
      .addFields({ name: "에러 코드", value: "CAN_NOT_JOIN_VOICE_CHANNEL" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  MUSIC_QUEUE_IS_EMPTY: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("재생중인 노래가 없습니다.")
      .addFields({ name: "에러 코드", value: "MUSIC_QUEUE_IS_EMPTY" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  CAN_NOT_FIND_MUSIC: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("노래를 찾을 수 없습니다.")
      .addFields({ name: "에러 코드", value: "CAN_NOT_FIND_MUSIC" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  CAN_NOT_USE_IN_DM: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("DM에서는 사용하실 수 없는 명령어입니다.")
      .addFields({ name: "에러 코드", value: "CAN_NOT_USE_IN_DM" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  GAME_IS_NOT_STARTED: function (client, interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("❌ 오류!")
      .setDescription("게임이 시작되지 않았습니다.")
      .addFields({ name: "에러 코드", value: "GAME_IS_NOT_STARTED" })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
