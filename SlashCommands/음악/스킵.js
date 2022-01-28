const player = require("../../events/player");

module.exports = {
    name: "스킵",
    description: "재생중인 음악을 넘깁니다.",

    run: async (client, interaction, args) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing) {
            interaction.followUp({ content: "재생중인 노래가 없습니다." });
        }

        await queue.skip();

        interaction.followUp({ content: "재생중인 노래를 넘겼습니다!" });
    },
};