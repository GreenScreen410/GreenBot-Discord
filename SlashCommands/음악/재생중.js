const player = require("../../events/player");

module.exports = {
    name: "재생중",
    description: "현재 재생중인 노래 정보를 알려줍니다.",

    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing) {
            interaction.followUp({ content: "재생중인 노래가 없습니다." });
            return;
        }

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [
                {
                    title: "재생중인 노래",
                    description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: "\u200b",
                            value: progress,
                        },
                    ],
                    color: client.config.clientColor,
                    footer: {
                        text: `신청자 : ${queue.current.requestedBy.tag}`,
                    },
                },
            ],
        });
    },
};