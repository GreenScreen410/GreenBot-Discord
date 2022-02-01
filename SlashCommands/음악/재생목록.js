const player = require("../../events/player");

module.exports = {
    name: "재생목록",
    description: "노래 재생목록을 확인합니다.",

    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        if (!queue?.playing) {
            interaction.followUp({ content: "재생중인 노래가 없습니다." });
            return;
        }

        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`
        });

        return interaction.followUp({
            embeds: [
                {
                    title: "노래 재생목록",
                    description: `${tracks.join("\n")}${queue.tracks.length > tracks.length
                            ? `\n...${queue.tracks.length - tracks.length === 1
                                ? `${queue.tracks.length - tracks.length
                                } more track`
                                : `${queue.tracks.length - tracks.length
                                } more tracks`
                            }`
                            : ""
                        }`,
                    color: "RANDOM",
                    fields: [
                        {
                            name: "재생중인 노래",
                            value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
                        },
                    ],
                },
            ],
        });
    }
}