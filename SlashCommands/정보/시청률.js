const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "시청률",
    description: "지상파 프로그램의 시청률을 알려줍니다.",
    options: [
        {
            name: "프로그램",
            description: "일부 프로그램은 나오지 않을 수 있습니다.",
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {

        // 파싱할 URL 정의
        var baseUrl = "https://search.naver.com/search.naver?query=" + encodeURIComponent(args) + "%EC%8B%9C%EC%B2%AD%EB%A5%A0";
        request(baseUrl, function(error, response, html) {
            try {
                const dom = new JSDOM(`${html}`);
                
                const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(args + " 시청률")
                .setDescription("최신 30회차 기준 정보입니다.")
                .addFields(
                    // F12 개발자 도구에 있는 selctor 복사 기능을 이용해 값 추출
                    { name: "최신 시청률", value: dom.window.document.querySelector("div.rating_bx.tag_newest > span > span.rating_ep").textContent + " - " + dom.window.document.querySelector("div.rating_bx.tag_newest > div > strong > span.percent_num").textContent + "%", inline: false },
                    { name: "최고 시청률", value: dom.window.document.querySelector("div.rating_bx.tag_highest > span > span.rating_ep").textContent + " - " + dom.window.document.querySelector("div.rating_bx.tag_highest > div > strong > span.percent_num").textContent + "%", inline: false }
                )
                .setTimestamp()
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                interaction.followUp({ embeds: [embed] });
            } catch (error) {
                var ERROR = require("../ERROR.js");
                ERROR.INVAILD_ARGUMENTS(client, interaction);
            }
        })
    },
};