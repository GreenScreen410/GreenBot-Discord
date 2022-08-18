const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("재생목록초기화")
    .setDescription("노래 재생목록을 초기화합니다."),

  run: function (client, interaction) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    queue.clear();

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("💥 펑!")
      .setDescription("재생목록이 초기화되었습니다!")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
