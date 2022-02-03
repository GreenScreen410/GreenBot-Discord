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

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("재생중인 노래")
            .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`)
            .addFields(
                { name: "\u200b", value: progress }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })

        return interaction.followUp({ embeds: [embed] });
    },
};