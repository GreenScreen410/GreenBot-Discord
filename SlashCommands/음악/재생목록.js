const { MessageEmbed } = require("discord.js");
const player = require("../../events/player");

module.exports = {
    name: "재생목록",
    description: "노래 재생목록을 확인합니다.",

    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);


        // 재생목록이 비어 있을 경우, 재생중인 노래가 없다고 출력
        if (!queue?.playing) {
            interaction.followUp({ content: "재생중인 노래가 없습니다." });
            return;
        }

        // 현재 재생목록을 currentTrack이라는 변수에 저장
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`
        });

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("노래 재생목록")
            .setDescription(`${tracks.join("\n")}${queue.tracks.length > tracks.length
                ? `\n...${queue.tracks.length - tracks.length === 1
                    ? `${queue.tracks.length - tracks.length
                    } more track`
                    : `${queue.tracks.length - tracks.length
                    } more tracks`
                }`
                : ""
                }`)
            .addFields(
                { name: "재생중인 노래", value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}` },
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })

        return interaction.followUp({ embeds: [embed] });
    }
}