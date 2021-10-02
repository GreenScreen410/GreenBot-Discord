const { MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    name: "단어퀴즈",
    description: "여러가지 단어퀴즈를 실행합니다.",

    run: async (client, interaction, args) => {
        const interactionUserId = interaction.user.id;
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("단어퀴즈")
            .setDescription("원하는 단어퀴즈 버튼을 눌러주세요!")
            .setTimestamp()
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("confusingEnglishWord")
                .setLabel("혼동되는 영단어")
                .setStyle("SECONDARY")
                .setEmoji("😖"),
            new MessageButton()
                .setCustomId("TESTING")
                .setLabel("TESTING")
                .setStyle("DANGER")
                .setEmoji("❌")
        );
        const filter = (interaction) => { if(interaction.user.id === interactionUserId) return true; };
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1 });

        // 혼동되는 영단어 변수
        const nextUrl = await fetch("https://wquiz.dict.naver.com/result.dict?service=endic&dictType=enko&quizId=f8f9ae4d2262404a8e9bcab945df4375&answerId=8c7a893b32c845f38187b791e823921d&group_id=11&seq=0");
        const nextUrlText = await nextUrl.text();
        const next = nextUrlText.split("showRandomQuiz('endic', 'enko',")[1].split(",")[0].replace(/'/g,"").trim();
        const quizUrl = await fetch("https://wquiz.dict.naver.com/result.dict?service=endic&dictType=enko&quizId=" + next + "&answerId=8c7a893b32c845f38187b791e823921d&group_id=11");
        const quizUrlText = await quizUrl.text();
        const main = quizUrlText.split("혼동되는 영단어 - ")[1].split("\" />")[0];
        const word1 = main.split(" vs")[0];
        const word2 = main.split("vs ")[1];
        const rightAnswer = quizUrlText.split("<span>정답</span>")[1].split("</em>")[0].replace(/<[^>]+>/g,"").trim();
        const explanation = quizUrlText.split("<p class=\"dsc_exp\" style=\"display:block-inline\">")[1].split("</p>")[0].replace("","\n").replace(/<[^>]+>/g,"");
        const questionUrl = await fetch("https://wquiz.dict.naver.com/quiz.dict?service=endic&dictType=koko&quizId="+next+"&group_id=11");
        const questionUrlText = await questionUrl.text();
        const question = questionUrlText.split("<em id=\"vote_name_id\">")[1].split("</em>")[0];

        collector.on("end", (ButtonInteraction) => {
            const id = ButtonInteraction.first().customId;
            if(id === "confusingEnglishWord") {
                const confusingEnglishWordEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("혼동되는 영단어")
                    .setDescription(`${question}`)
                    .setTimestamp()
                    .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        
                const confusingEnglishWordRow = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`${word1}`)
                        .setLabel(`${word1}`)
                        .setStyle("SECONDARY")
                        .setEmoji("1️⃣"),
                    new MessageButton()
                        .setCustomId(`${word2}`)
                        .setLabel(`${word2}`)
                        .setStyle("SECONDARY")
                        .setEmoji("2️⃣")
                );
                const confusingEnglishWordCollector = interaction.channel.createMessageComponentCollector({ filter, max: 1 });
                confusingEnglishWordCollector.on("collect", async i => {
                    const confusingEnglishWordCorrectEmbed = new MessageEmbed()
                        .setColor("#81C147")
                        .setTitle("✔️ 정답입니다!")
                        .setDescription(`${explanation}`)
                        .setTimestamp()
                        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                    if(i.customId == `${rightAnswer}`) return interaction.channel.send({ embeds: [confusingEnglishWordCorrectEmbed], ephemeral: true })

                    const confusingEnglishWordIncorrectEmbed = new MessageEmbed()
                        .setColor("#E71837")
                        .setTitle("❌ 오답입니다!")
                        .setDescription(`${explanation}`)
                        .setTimestamp()
                        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                    if(i.customId !== `${rightAnswer}`) return interaction.channel.send({ embeds: [confusingEnglishWordIncorrectEmbed], ephemeral: true})
                });

                interaction.channel.send({ embeds: [confusingEnglishWordEmbed], components: [confusingEnglishWordRow] })
            }
            if(id === "TESTING") return interaction.channel.send("테스트용 버튼을 누르시다니!")
        });

        interaction.channel.send({ embeds: [embed], components: [row] })
    },
};