const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  musicSkip: function (client, interaction) {
    const queue = player.getQueue(interaction.guildId);

    // 재생중인 노래가 없을 때
    if (!queue || !queue.playing) {
      ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
      return;
    }
    queue.skip();

    interaction.followUp({ content: "재생중인 노래를 넘겼습니다!" });
  },
};
