const { MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
    name: "재생중",
    description: "현재 재생중인 노래 정보를 알려줍니다.",

    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        if (!queue?.playing) {
            ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
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
        
            const button = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("musicQueue")
                .setEmoji("📄")
                .setLabel("재생목록")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("musicSkip")
                .setEmoji("⏭")
                .setLabel("넘기기")
                .setStyle("PRIMARY"),
        )

        interaction.followUp({ content: [embed], components: [button] });
    },
};