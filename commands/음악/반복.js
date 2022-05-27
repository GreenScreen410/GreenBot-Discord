const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueueRepeatMode } = require("discord-player");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("반복")
    .setDescription("재생중인 노래를 반복합니다.")
    .addStringOption(option =>
      option.setName("옵션")
        .setDescription("옵션을 지정해 주세요.")
        .setRequired(true)
        .addChoices({ name: "노래", value: "QUEUE" })
        .addChoices({ name: "끄기", value: "OFF" })
    ),

  run: function (client, interaction) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    if (interaction.options.getString("옵션") === "QUEUE") {
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🔁 반복 재생이 **활성화** 되었습니다.")
        .setDescription(`${queue.current.title}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("옵션") === "OFF") {
      queue.setRepeatMode(QueueRepeatMode.OFF);
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🔁 반복 재생이 **비활성화** 되었습니다.")
        .setDescription(`${queue.current.title}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      return interaction.followUp({ embeds: [embed] });
    }
  },
};
