const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const translate = require("../../handler/translate.js");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("트리비아")
    .setDescription("잡다한 지식들을 얻어보세요! (문제가 번역되어 나오므로 자연스럽지 않을 수 있습니다."),

  run: async (client, interaction) => {
    try {
      let opentdbData = await axios.get("https://opentdb.com/api.php?amount=1&encode=url3986");
      opentdbData = JSON.parse(JSON.stringify(opentdbData.data));

      const category = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].category));

      let difficulty = decodeURIComponent(opentdbData.results[0].difficulty);
      if (difficulty == "easy") difficulty = "쉬움";
      if (difficulty == "medium") difficulty = "중간";
      if (difficulty == "hard") difficulty = "어려움";

      const type = decodeURIComponent(opentdbData.results[0].type);
      const question = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].question));

      let correctAnswer = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].correct_answer));
      if (correctAnswer == "진실의") correctAnswer = "참";
      if (correctAnswer == "거짓의") correctAnswer = "거짓";

      let incorrectAnswer1 = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].incorrect_answers[0]));
      if (incorrectAnswer1 == "진실의") incorrectAnswer1 = "참";
      if (incorrectAnswer1 == "거짓의") incorrectAnswer1 = "거짓";

      let incorrectAnswer2 = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].incorrect_answers[1]));

      let incorrectAnswer3 = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].incorrect_answers[2]));

      const multipleButtons = [
        new MessageButton().setCustomId("correctAnswer").setLabel(`${correctAnswer}`).setStyle("PRIMARY"),
        new MessageButton().setCustomId("incorrectAnswer1").setLabel(`${incorrectAnswer1}`).setStyle("PRIMARY"),
        new MessageButton().setCustomId("incorrectAnswer2").setLabel(`${incorrectAnswer2}`).setStyle("PRIMARY"),
        new MessageButton().setCustomId("incorrectAnswer3").setLabel(`${incorrectAnswer3}`).setStyle("PRIMARY"),
      ]
      multipleButtons.sort(() => Math.random() - 0.5);
      const multipleRow = new MessageActionRow().addComponents(...multipleButtons)

      const booleanButtons = [
        new MessageButton().setCustomId("correctAnswer").setLabel(`${correctAnswer}`).setStyle("PRIMARY"),
        new MessageButton().setCustomId("incorrectAnswer1").setLabel(`${incorrectAnswer1}`).setStyle("PRIMARY"),
      ]
      booleanButtons.sort(() => Math.random() - 0.5);
      const booleanRow = new MessageActionRow().addComponents(...booleanButtons)

      const mainEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🧠 트리비아")
        .setDescription(`${question}`)
        .addFields(
          { name: "원문", value: `${decodeURIComponent(opentdbData.results[0].question)}`, inline: false },
          { name: "📋 카테고리", value: `${category}`, inline: true },
          { name: "🤔 난이도", value: `${difficulty}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      if (type === "multiple") {
        interaction.followUp({ embeds: [mainEmbed], components: [multipleRow] });
      } else {
        interaction.followUp({ embeds: [mainEmbed], components: [booleanRow] });
      }

      const collector = interaction.channel.createMessageComponentCollector({ max: 1, time: 15000 });
      collector.on("collect", i => {
        i.deferUpdate();

        if (i.customId === "correctAnswer") {
          const correctEmbed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle(`✅ ${i.user.tag}님 정답!`)
            .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: `${i.user.displayAvatarURL()}` });
          return interaction.followUp({ embeds: [correctEmbed] });

        } else {
          const wrongEmbed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(`❌ ${i.user.tag}님 오답!`)
            .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: `${i.user.displayAvatarURL()}` });
          return interaction.followUp({ embeds: [wrongEmbed] });
        }
      });

      collector.on("end", collected => {
        if (collected.size === 0) {
          const timeoutEmbed = new MessageEmbed()
            .setColor("#FFFF00")
            .setTitle(`⏰ ${interaction.user.tag}님 시간 초과!`)
            .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
          return interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });

    } catch (error) {
      interaction.followUp({ content: `오류가 발생했습니다.\n${error}` });
    }
  }
};
