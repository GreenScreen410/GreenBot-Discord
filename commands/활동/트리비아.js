const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

async function papago(text) {
  let translatedText = await axios({
    method: "POST",
    url: "https://openapi.naver.com/v1/papago/n2mt",
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
    },

    data: {
      source: "en",
      target: "ko",
      text: `${text}`
    },
  });

  translatedText = JSON.parse(JSON.stringify(translatedText.data));
  translatedText = translatedText.message.result.translatedText

  return translatedText;
}

module.exports = {
  ...new SlashCommandBuilder()
    .setName("트리비아")
    .setDescription("잡다한 지식들을 얻어보세요!"),

  run: async (client, interaction) => {
    let opentdbData = await axios.get("https://opentdb.com/api.php?amount=1");
    opentdbData = JSON.parse(JSON.stringify(opentdbData.data));

    const category = await papago(opentdbData.results[0].category);

    let difficulty = opentdbData.results[0].difficulty;
    if (difficulty === "easy") {
      difficulty = "쉬움";
    } else if (difficulty === "medium") {
      difficulty = "중간";
    } else if (difficulty === "hard") {
      difficulty = "어려움";
    }

    const type = opentdbData.results[0].type;

    let question = await papago(opentdbData.results[0].question);
    question = question.replace(/&quot;/g, '"');

    let correct_answer = await papago(opentdbData.results[0].correct_answer);
    correct_answer = correct_answer.replace(/&quot;/g, '"');

    let incorrect_answers = await papago(opentdbData.results[0].incorrect_answers);
    incorrect_answers = incorrect_answers.split(",");

    const multipleButtons = [
      new MessageButton().setCustomId("correctAnswer").setLabel(`${correct_answer}`).setStyle("PRIMARY"),
      new MessageButton().setCustomId("answer1").setLabel(`${incorrect_answers[0]}`).setStyle("PRIMARY"),
      new MessageButton().setCustomId("answer2").setLabel(`${incorrect_answers[1]}`).setStyle("PRIMARY"),
      new MessageButton().setCustomId("answer3").setLabel(`${incorrect_answers[2]}`).setStyle("PRIMARY"),
    ]
    const multipleRow = new MessageActionRow().addComponents(...multipleButtons)

    const booleanButtons = [
      new MessageButton().setCustomId("correctAnswer").setLabel(`${correct_answer}`).setStyle("PRIMARY"),
      new MessageButton().setCustomId("answer1").setLabel(`${incorrect_answers[0]}`).setStyle("PRIMARY"),
    ]
    const booleanRow = new MessageActionRow().addComponents(...booleanButtons)

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("🧠 트리비아")
      .setDescription(`${question}`)
      .addFields(
        { name: "📋 카테고리", value: `${category}`, inline: true },
        { name: "🤔 난이도", value: `${difficulty}`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    if (type === "multiple") {
      interaction.followUp({ embeds: [embed], components: [multipleRow] });
    } else {
      interaction.followUp({ embeds: [embed], components: [booleanRow] });
    }
    
    
  }
};
