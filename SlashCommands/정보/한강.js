const request = require("request");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "한강",
    description: "현재 한강의 수온을 알려줍니다.",

    run: async (client, interaction, args) => {

        // 파싱할 URL 정의
        var hangangUrl = "http://hangang.dkserver.wo.tc/";
        request(hangangUrl, function(error, response, html) {
            var url = JSON.parse(html);
            try {
                const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${url.temp}℃`)
                .setDescription(`${url.time} 기준`)
                .setTimestamp()
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                interaction.followUp({ embeds: [embed] });
            } catch (error) {
                console.log(error);
            }
        })
    },
};