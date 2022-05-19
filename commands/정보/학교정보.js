const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("학교정보")
    .setDescription("학교의 기본 정보를 알려줍니다.")
    .addStringOption((option) => option.setName("학교명").setDescription("정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.").setRequired(true)),

  run: async (client, interaction) => {
    const schoolName = interaction.options.getString("학교명");
    let schoolData = await axios.get(`https://schoolmenukr.ml/code/api?q=${encodeURIComponent(schoolName)}`);
    console.log(schoolData);
    schoolData = JSON.parse(JSON.stringify(schoolData.data));

    try {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${schoolData.school_infos[0].name} 정보`)
        .setDescription(`${schoolData.school_infos[0].website}`)
        .addFields(
          { name: "개교일", value: `${schoolData.school_infos[0].estDate["y"]}년 ${schoolData.school_infos[0].estDate["m"]}월 ${schoolData.school_infos[0].estDate["d"]}일`, inline: true },
          { name: "주소", value: `${schoolData.school_infos[0].address}`, inline: false },
          { name: "전화번호", value: `${schoolData.school_infos[0].phone}`, inline: false },
          { name: "학교코드", value: `${schoolData.school_infos[0].code}`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      interaction.followUp({ embeds: [embed] });

    } catch (error) {
      ERROR.INVALID_ARGUMENT(client, interaction);
    }
  },
}
