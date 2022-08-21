const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const translate = require("../../handler/translate.js");
const ERROR = require("../ERROR.js");

let game = false;

module.exports = {
  ...new SlashCommandBuilder()
    .setName("트리비아")
    .setDescription("잡다한 지식들을 얻어보세요! (문제가 번역되어 나오므로 자연스럽지 않을 수 있습니다.")
    .addStringOption(option =>
      option.setName("카테고리")
        .setDescription("원하시는 카테고리를 선택해 주세요.")
        .setRequired(false)
        .addChoices({ name: "일반 지식", value: "9" })
        .addChoices({ name: "엔터테인먼트: 북스", value: "10" })
        .addChoices({ name: "엔터테인먼트: 영화", value: "11" })
        .addChoices({ name: "엔터테인먼트: 음악", value: "12" })
        .addChoices({ name: "엔터테인먼트: 뮤지컬 & 극장", value: "13" })
        .addChoices({ name: "엔터테인먼트: 텔레비전", value: "14" })
        .addChoices({ name: "엔터테인먼트: 비디오 게임", value: "15" })
        .addChoices({ name: "엔터테인먼트: 보드 게임", value: "16" })
        .addChoices({ name: "과학 & 자연", value: "17" })
        .addChoices({ name: "과학: 컴퓨터", value: "18" })
        .addChoices({ name: "과학: 수학", value: "19" })
        .addChoices({ name: "신화", value: "20" })
        .addChoices({ name: "스포츠", value: "21" })
        .addChoices({ name: "지리학", value: "22" })
        .addChoices({ name: "역사", value: "23" })
        .addChoices({ name: "정치", value: "24" })
        .addChoices({ name: "예체능", value: "25" })
        .addChoices({ name: "유명인들", value: "26" })
        .addChoices({ name: "동물", value: "27" })
        .addChoices({ name: "교통 수단", value: "28" })
        .addChoices({ name: "엔터테인먼트: 코믹스", value: "29" })
        .addChoices({ name: "과학: 가젯", value: "30" })
        .addChoices({ name: "엔터테인먼트: 일본 애니메이션 & 만화", value: "31" })
        .addChoices({ name: "엔터테인먼트: 카툰 & 애니메이션", value: "32" }),
    ),

  run: async (client, interaction) => {
    if (client.cooldowns.has(interaction.user.id)) {
      return ERROR.COOLDOWN_ACTIVATED(client, interaction);
    } else {
      client.cooldowns.set(interaction.user.id, true);

      setTimeout(() => {
        client.cooldowns.delete(interaction.user.id);
      }, 5000);
    }

    try {
      if (game == true) {
        return ERROR.GAME_IS_ALREADY_STARTED(client, interaction);
      }

      let opentdbData = await axios.get(`https://opentdb.com/api.php?amount=1&category=${interaction.options.getString("카테고리")}&encode=url3986`);

      if (!interaction.options.getString("카테고리")) {
        opentdbData = await axios.get(`https://opentdb.com/api.php?amount=1&encode=url3986`);
      }

      opentdbData = JSON.parse(JSON.stringify(opentdbData.data));

      const category = await translate.papago("en", "ko", decodeURIComponent(opentdbData.results[0].category));
      let difficulty = decodeURIComponent(opentdbData.results[0].difficulty);
      const type = decodeURIComponent(opentdbData.results[0].type);
      const question = await translate.kakao("en", "kr", decodeURIComponent(opentdbData.results[0].question));
      let correctAnswer = decodeURIComponent(opentdbData.results[0].correct_answer);
      let incorrectAnswer1 = decodeURIComponent(opentdbData.results[0].incorrect_answers[0]);
      let incorrectAnswer2 = decodeURIComponent(opentdbData.results[0].incorrect_answers[1]);
      let incorrectAnswer3 = decodeURIComponent(opentdbData.results[0].incorrect_answers[2]);

      if (difficulty == "easy") difficulty = "쉬움";
      if (difficulty == "medium") difficulty = "중간";
      if (difficulty == "hard") difficulty = "어려움";
      if (correctAnswer == "True") correctAnswer = "참";
      if (correctAnswer == "False") correctAnswer = "거짓";
      if (incorrectAnswer1 == "True") incorrectAnswer1 = "참";
      if (incorrectAnswer1 == "False") incorrectAnswer1 = "거짓";

      const multipleButtons = [
        new ButtonBuilder().setCustomId(`correctAnswer-${client.guilds.cache.get.id}`).setLabel(`${correctAnswer + " (" + await translate.kakao("en", "kr", correctAnswer) + ")"}`).setStyle(1),
        new ButtonBuilder().setCustomId(`incorrectAnswer1-${client.guilds.cache.get.id}`).setLabel(`${incorrectAnswer1 + " (" + await translate.kakao("en", "kr", incorrectAnswer1) + ")"}`).setStyle(1),
        new ButtonBuilder().setCustomId(`incorrectAnswer2-${client.guilds.cache.get.id}`).setLabel(`${incorrectAnswer2 + " (" + await translate.kakao("en", "kr", incorrectAnswer2) + ")"}`).setStyle(1),
        new ButtonBuilder().setCustomId(`incorrectAnswer3-${client.guilds.cache.get.id}`).setLabel(`${incorrectAnswer3 + " (" + await translate.kakao("en", "kr", incorrectAnswer3) + ")"}`).setStyle(1),
      ]
      multipleButtons.sort(() => Math.random() - 0.5);
      const multipleRow = new ActionRowBuilder().addComponents(...multipleButtons)

      const booleanButtons = [
        new ButtonBuilder().setCustomId(`correctAnswer-${client.guilds.cache.get.id}`).setLabel(`${correctAnswer}`).setStyle(1),
        new ButtonBuilder().setCustomId(`incorrectAnswer1-${client.guilds.cache.get.id}`).setLabel(`${incorrectAnswer1}`).setStyle(1),
      ]
      booleanButtons.sort(() => Math.random() - 0.5);
      const booleanRow = new ActionRowBuilder().addComponents(...booleanButtons)

      if (type === "multiple") {
        const multipleEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("🧠 트리비아")
          .setDescription(`${question}`)
          .addFields(
            { name: "원문", value: `${decodeURIComponent(opentdbData.results[0].question)}`, inline: false },
            { name: "📋 카테고리", value: `${category}`, inline: true },
            { name: "🤔 난이도", value: `${difficulty}`, inline: true },
          )
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

        interaction.followUp({ embeds: [multipleEmbed], components: [multipleRow] });

      } else {
        const booleanEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("🧠 트리비아")
          .setDescription(`${question}`)
          .addFields(
            { name: "원문", value: `${decodeURIComponent(opentdbData.results[0].question)}`, inline: false },
            { name: "📋 카테고리", value: `${category}`, inline: true },
            { name: "🤔 난이도", value: `${difficulty}`, inline: true },
          )
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

        interaction.followUp({ embeds: [booleanEmbed], components: [booleanRow] });
      }

      game = true;

      const collector = interaction.channel.createMessageComponentCollector({ max: 1, time: 30000 });
      collector.on("collect", i => {
        i.deferUpdate();

        if (i.customId === `correctAnswer-${client.guilds.cache.get.id}`) {
          const correctEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(`✅ ${i.user.tag}님 정답!`)
            .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: `${i.user.displayAvatarURL()}` });
          interaction.followUp({ embeds: [correctEmbed] });
          return game = false;

        } else {
          const wrongEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle(`❌ ${i.user.tag}님 오답!`)
            .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: `${i.user.displayAvatarURL()}` });
          interaction.followUp({ embeds: [wrongEmbed] });
          return game = false;
        }
      });

      collector.on("end", collected => {
        if (collected.size === 0) {
          const timeoutEmbed = new EmbedBuilder()
            .setColor("#FFFF00")
            .setTitle(`⏰ ${interaction.user.tag}님 시간 초과!`)
            .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
          interaction.followUp({ embeds: [timeoutEmbed] });
          return game = false;
        }
      });

    } catch (error) {
      console.log(error);
      return ERROR.UNKNOWN_ERROR(client, interaction);
    }
  }
};