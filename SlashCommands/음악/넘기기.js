const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  name: "넘기기",
  description: "재생중인 노래를 넘깁니다.",

  run: async (client, interaction) => {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }

    queue.skip();

    interaction.followUp({ content: "재생중인 노래를 넘겼습니다!" });
  },
};
