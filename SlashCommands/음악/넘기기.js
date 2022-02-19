const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  name: "넘기기",
  description: "재생중인 노래를 넘깁니다.",

  run: async (client, interaction) => {
    const queue = player.getQueue(interaction.guildId);

    // 재생목록이 없을 때 또는(||) 재생중인 노래가 없을 때
    if (!queue || !queue.playing) {
      // ERROR 파일의 MUSIC_QUEUE_IS_EMPTY 함수 실행
      ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    // 노래 넘기기
    queue.skip();

    interaction.followUp({ content: "재생중인 노래를 넘겼습니다!" });
  },
};
