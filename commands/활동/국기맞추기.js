const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const ERROR = require("../ERROR.js");

let game = false;
let flagData, translatedCountryName, correctAnswer;

module.exports = {
  ...new SlashCommandBuilder()
    .setName("국기맞추기")
    .setDescription("국기를 맞춰보세요!")
    .addStringOption((option) => option.setName("정답").setDescription("정답을 입력해 주세요.")),

  run: async (client, interaction) => {
    const answer = interaction.options.getString("정답");

    if (game == false && answer != null) {
      return ERROR.GAME_IS_NOT_STARTED(client, interaction);
    }

    if (game == false) {
      flagData = await axios.get("https://api.dagpi.xyz/data/flag", { headers: { "Authorization": process.env.DAGPI_TOKEN } });
      translatedCountryName = await axios({
        method: "POST",
        url: "https://openapi.naver.com/v1/papago/n2mt",
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
        },

        data: {
          source: "en",
          target: "ko",
          text: `${flagData.data.Data.name.common}`
        },
      });

      flagData = JSON.parse(JSON.stringify(flagData.data));
      translatedCountryName = JSON.parse(JSON.stringify(translatedCountryName.data));
      correctAnswer = (translatedCountryName.message.result.translatedText).replace(/\./g, "").replace("의", "");
    }

    game = true;

    if (game == true && answer == null) {
      const mainEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("국기를 맞혀보세요!")
        .setDescription("(가끔 사진이 불러와지지 않는 오류가 있습니다.\n아무 답이나 입력해서 넘겨주세요.)")
        .setThumbnail(`${flagData.flag}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      interaction.followUp({ embeds: [mainEmbed] });
    }

    if (game == true && answer == correctAnswer) {
      const correctEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`✅ ${interaction.user.tag}님 정답!`)
        .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
        .setThumbnail(`${flagData.flag}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      interaction.followUp({ embeds: [correctEmbed] });
      return game = false;
    }

    if (game == true && answer != correctAnswer && answer != null) {
      const wrongEmbed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle(`❌ ${interaction.user.tag}님 오답!`)
        .setDescription(`정답은 **'${correctAnswer}'** 이였습니다.`)
        .setThumbnail(`${flagData.flag}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      interaction.followUp({ embeds: [wrongEmbed] });
      return game = false;
    }


  }
};
