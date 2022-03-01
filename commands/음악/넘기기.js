const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueueRepeatMode } = require("discord-player");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("넘기기")
    .setDescription("재생중인 노래를 넘깁니다."),

  run: async (client, interaction) => {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    queue.setRepeatMode(QueueRepeatMode.OFF);
    queue.skip();

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("⏩ 재생중인 노래를 넘겼습니다!")
      .setDescription(`${queue.current.title}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
  },
};
