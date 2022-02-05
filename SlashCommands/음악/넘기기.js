const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
    musicSkip: function (client, interaction) {
        const queue = player.getQueue(interaction.guildId);

        // 재생목록이 비어 있을 경우, 재생중인 노래가 없다고 출력
        if (!queue?.playing) {
            ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
            return;
        }

        // 재생중인 노래 넘기기
        queue.skip();

        interaction.followUp({ content: "재생중인 노래를 넘겼습니다!" });
    },
};