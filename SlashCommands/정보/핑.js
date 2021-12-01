const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "핑",
    description: "반응 속도를 반환합니다.",

    run: async (client, interaction) => {
        const embed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("🏓 퐁!")
            .setDescription(`반응 속도 : ${client.ws.ping}ms`)
            .setTimestamp()
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            
        interaction.followUp({ embeds: [embed] });
    },
};
