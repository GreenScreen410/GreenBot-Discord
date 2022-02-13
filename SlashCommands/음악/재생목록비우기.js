const { MessageEmbed } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  musicQueueClear: function (client, interaction) {
    const queue = player.getQueue(interaction.guildId);

    // 재생중인 노래가 없을 때
    if (!queue || !queue.playing) {
      ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
      return;
    }
    queue.clear();

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("💥 재생목록이 초기화되었습니다!")
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },
};
