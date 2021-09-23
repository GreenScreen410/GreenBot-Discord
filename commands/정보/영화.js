const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://movie.naver.com/movie/running/current.nhn?view=list&tab=normal&order=reserve';

module.exports = {
    name: "영화",
    description: "예매율 상위 5개 영화를 알려줍니다.",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    run: async (client, interaction, args) => {
        
        axios.get(url).then(res => {
            if (res.status === 200) {
                let crawledMovie = [];
                const $ = cheerio.load(res.data);
                const $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');
          
                $movieList.each(function (i) {
                crawledMovie[i] = {
                title: $(this).find('dt.tit a').text(),
                img: $(this).find('div.thumb img').attr('src'),
                star: $(this).find('span.num').text().replace(/\t/gi, '').replace(/\n/gi,'')
                };
            });
            
                const data = crawledMovie.filter(m => m.title);
                const embed = {

                    color: 0x434343,
                    title: "실시간 영화 예매율",
                    description: "네이버 영화 기준",
                    fields: [
                        {
                            name: data[0].title,
                            value: "⭐ " + data[0].star.substring(0, 3)
                        },
                        {
                            name: data[1].title,
                            value: "⭐ " + data[1].star.substring(0, 3)
                        },
                        {
                            name: data[2].title,
                            value: "⭐ " + data[2].star.substring(0, 3)
                        },
                        {
                            name: data[3].title,
                            value: "⭐ " + data[3].star.substring(0, 3)
                        },
                        {
                            name: data[4].title,
                            value: "⭐ " + data[4].star.substring(0, 3)
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `Requested by ${interaction.user.tag}`,
                        icon_url: interaction.user.displayAvatarURL()
                    }
                }
                interaction.followUp({ embeds: [embed] });
            }
        }, (error) => console.log(error));
    },
};