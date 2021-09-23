const { MessageEmbed } = require("discord.js");

var cheerio = require("cheerio");
var request = require("request");
const { PLEASE_TYPE_ARGUMENTS } = require("../ERROR.js");

module.exports = {
    name: "학교정보",
    description: "학교의 기본 정보를 알려줍니다",
    options: [
        {
            name: "학교",
            description: "정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.",
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        var baseUrl = "https://schoolmenukr.ml/code/api?q=" + encodeURIComponent(args);
        request(baseUrl, function(error, response, html) {
            var url = JSON.parse(html);

            try {
                const embed = new MessageEmbed()
                .setColor("#F8DE29")
                .setTitle(url.school_infos[0].name + " 정보")
                .setDescription(url.school_infos[0].estDate["y"] + "년 " + url.school_infos[0].estDate["m"] + "월 " + url.school_infos[0].estDate["d"] + "일 개교")
                .addFields(
                    { name: "웹사이트", value: url.school_infos[0].website, inline: false },
                    { name: "전화번호", value: url.school_infos[0].phone, inline: false },
                    { name: "주소", value: url.school_infos[0].address, inline: false },
                    { name: "학교 코드", value: url.school_infos[0].code, inline: false },
                )
                .setTimestamp()
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                interaction.followUp({ embeds: [embed] });
                // console.log(url.school_infos[0].name)
            } catch(error) {
                var ERROR = require("../ERROR.js");
                ERROR.INVAILD_ARGUMENTS(client, interaction);
            }
        } 
    )}
};