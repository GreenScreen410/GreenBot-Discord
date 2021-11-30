const { MessageEmbed } = require("discord.js");

module.exports = {
    PLEASE_TYPE_ARGUMENTS: function(client, interaction) {
        const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("❌ 오류!")
        .setDescription("인자가 주어지지 않았습니다.")
        .addFields(
            { name: "에러 코드", value: "PLEASE_TYPE_ARGUMENTS" },
        )
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        interaction.followUp({ embeds: [embed] });
    },

    INVAILD_ARGUMENTS: function(client, interaction) {
        const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("❌ 오류!")
        .setDescription("올바르지 않은 인자입니다.")
        .addFields(
            { name: "에러 코드", value: "INVAILD_ARGUMENTS" },
        )
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        interaction.followUp({ embeds: [embed] });
    },

    BAD_REQUEST: function(client, interaction) {
        const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("❌ 오류!")
        .setDescription("웹사이트 서버 요청에 실패하였습니다.")
        .addFields(
            { name: "에러 코드", value: "BAD_REQUEST" },
        )
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        interaction.followUp({ embeds: [embed] });
    },

    PLEASE_JOIN_VOICE_CHANNEL: function(client, interaction) {
        const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("❌ 오류!")
        .setDescription("먼저 음성 채널에 연결해 주세요.")
        .addFields(
            { name: "에러 코드", value: "PLEASE_JOIN_VOICE_CHANNEL" },
        )
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        interaction.followUp({ embeds: [embed] });
    },
}