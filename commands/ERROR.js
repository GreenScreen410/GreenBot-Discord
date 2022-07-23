const { EmbedBuilder } = require("discord.js");

const embed = new EmbedBuilder()
  .setColor("#FF0000")
  .setTitle("❌ 오류!")
  .setTimestamp()

module.exports = {
  UNKNOWN_ERROR: function (client, interaction) {
    embed.setDescription("알 수 없는 오류가 발생하였습니다.")
    embed.addFields({ name: "에러 코드", value: "UNKNOWN_ERROR" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  INVALID_INTERACTION: function (client, interaction) {
    embed.setDescription("올바르지 않은 명령어입니다.")
    embed.addFields({ name: "에러 코드", value: "INVALID_INTERACTION" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  THIS_COMMAND_IS_FIXING: function (client, interaction) {
    embed.setDescription("해당 명령어는 현재 수리중입니다.")
    embed.addFields({ name: "에러 코드", value: "THIS_COMMAND_IS_FIXING" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_TYPE_ARGUMENTS: function (client, interaction) {
    embed.setDescription("인자가 주어지지 않았습니다.")
    embed.addFields({ name: "에러 코드", value: "PLEASE_TYPE_ARGUMENTS" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  INVALID_ARGUMENT: function (client, interaction) {
    embed.setDescription("잘못된 인자입니다.")
    embed.addFields({ name: "에러 코드", value: "INVALID_ARGUMENT" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  COOLDOWN_ACTIVATED: function (client, interaction) {
    embed.setDescription("잠시 후 다시 시도해주세요.")
    embed.addFields({ name: "에러 코드", value: "COOLDOWN_ACTIVATED" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    return interaction.followUp({ embeds: [embed] });
  },

  PLEASE_JOIN_VOICE_CHANNEL: function (client, interaction) {
    embed.setDescription("먼저 음성 채널에 접속해 주세요.")
    embed.addFields({ name: "에러 코드", value: "PLEASE_JOIN_VOICE_CHANNEL" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  PLEASE_JOIN_SAME_VOICE_CHANNEL: function (client, interaction) {
    embed.setDescription("같은 음성 채널에 접속해 주세요.")
    embed.addFields({ name: "에러 코드", value: "PLEASE_JOIN_SAME_VOICE_CHANNEL" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  CAN_NOT_JOIN_VOICE_CHANNEL: function (client, interaction) {
    embed.setDescription("음성 채널에 접속할 수 없습니다.")
    embed.addFields({ name: "에러 코드", value: "CAN_NOT_JOIN_VOICE_CHANNEL" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  MUSIC_QUEUE_IS_EMPTY: function (client, interaction) {
    embed.setDescription("재생중인 노래가 없습니다.")
    embed.addFields({ name: "에러 코드", value: "MUSIC_QUEUE_IS_EMPTY" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  MUSIC_IS_PLAYING: function (client, interaction) {
    embed.setDescription("재생중인 노래가 있습니다.")
    embed.addFields({ name: "에러 코드", value: "MUSIC_IS_PLAYING" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  CAN_NOT_FIND_MUSIC: function (client, interaction) {
    embed.setDescription("노래를 찾을 수 없습니다.")
    embed.addFields({ name: "에러 코드", value: "CAN_NOT_FIND_MUSIC" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  CAN_NOT_USE_IN_DM: function (client, interaction) {
    embed.setDescription("DM에서는 사용하실 수 없는 명령어입니다.")
    embed.addFields({ name: "에러 코드", value: "CAN_NOT_USE_IN_DM" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },

  GAME_IS_NOT_STARTED: function (client, interaction) {
    embed.setDescription("게임이 시작되지 않았습니다.")
    embed.addFields({ name: "에러 코드", value: "GAME_IS_NOT_STARTED" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    interaction.followUp({ embeds: [embed] });
  },

  GAME_IS_ALREADY_STARTED: function (client, interaction) {
    embed.setDescription("게임이 시작되었습니다.")
    embed.addFields({ name: "에러 코드", value: "GAME_IS_ALREADY_STARTED" })
    embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
