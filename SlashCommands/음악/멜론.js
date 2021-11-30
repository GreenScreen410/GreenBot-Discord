const { MessageEmbed } = require("discord.js");

var cheerio = require("cheerio");
var request = require("request");

var url = "http://www.melon.com/chart/";
var title = new Array(),
    artist = new Array(),
    up_date,
    up_time;
var rank = 10; // 10위까지 확인

module.exports = {
    name: "멜론",
    description: "멜론 차트를 알려줍니다.",
    run: async (client, interaction) => {

        request(url, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                // 곡명 파싱
                for (var i = 0; i < rank; i++) {
                    $(".ellipsis.rank01 > span > a").each(function() {
                        var title_info = $(this);
                        var title_info_text = title_info.text();
                        title[i] = title_info_text;
                        i++;
                    })
                }

                // 아티스트명 파싱
                for (var i = 0; i < rank; i++) {
                    $(".checkEllipsis").each(function() {
                        var artist_info = $(this);
                        var artist_info_text = artist_info.text();
                        artist[i] = artist_info_text;
                        i++;
                    })
                }

                // 업데이트 날짜
                $(".year").each(function() {
                    var date_info = $(this);
                    var date_info_text = date_info.text();
                    up_date = date_info_text;
                })

                // 업데이트 시간
                $(".hhmm > span").each(function() {
                    var time_info = $(this);
                    var time_info_text = time_info.text();
                    up_time = time_info_text;
                })

                // xxxx년 xx월 xx일 오후/오전 xx시 형식
                var up_date_arr = new Array();
                var up_date_arr = up_date.split('.');
                var up_time_arr = new Array();
                var up_time_arr = up_time.split(':');
                var newtime;

                // 오후 오전 삽입
                if (up_time_arr[0] > 12) {
                    up_time_arr[0] = up_time_arr[0] - 12
                    newtime = "오후 " + up_time_arr[0];
                } else {
                    newtime = "오전 " + up_time_arr[0];
                }

                // 콘솔창 출력
                // console.log("< 멜론 차트 1 ~ " + rank + "위 >");

                // 순위 제목 - 아티스트명
                for (var i = 1; i < rank + 1; i++) {
                    // console.log(i + "위" + " " + title[i - 1] + " - " + artist[i - 1]);
                }
                // 업데이트 시간
                // console.log("(" + up_date_arr[0] + "년 " + up_date_arr[1] + "월 " + up_date_arr[2] + "일 " + newtime + "시에 업데이트됨)");
            
                const embed = new MessageEmbed()
                .setColor("#00CD3C")
                .setTitle(`멜론 차트 1 ~ ${rank}위`)
                .setDescription(up_date_arr[0] + "년 " + up_date_arr[1] + "월 " + up_date_arr[2] + "일 " + newtime + "시 업데이트")
                .addFields(
                    { name: "1위", value: `${title[0]} - ${artist[0]}`, inline: false },
                    { name: "2위", value: `${title[1]} - ${artist[1]}`, inline: false },
                    { name: "3위", value: `${title[2]} - ${artist[2]}`, inline: false },
                    { name: "4위", value: `${title[3]} - ${artist[3]}`, inline: false },
                    { name: "5위", value: `${title[4]} - ${artist[4]}`, inline: false },
                    { name: "6위", value: `${title[5]} - ${artist[5]}`, inline: false },
                    { name: "7위", value: `${title[6]} - ${artist[6]}`, inline: false },
                    { name: "8위", value: `${title[7]} - ${artist[7]}`, inline: false },
                    { name: "9위", value: `${title[8]} - ${artist[8]}`, inline: false },
                    { name: "10위", value: `${title[9]} - ${artist[9]}`, inline: false },
                )
                .setTimestamp()
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                interaction.followUp({ embeds: [embed] });
            };
        });
    },
};