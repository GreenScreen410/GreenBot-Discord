import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("학교정보")
    .setDescription("학교의 기본 정보를 알려줍니다.")
    .addStringOption((option) => option
      .setName("학교명")
      .setDescription("정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.")
      .setRequired(true)),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const school = interaction.options.getString("학교명", true);

    try {
      let schoolData: any = await axios.get(`https://schoolmenukr.ml/code/api?q=${encodeURIComponent(school)}`);
      schoolData = JSON.parse(JSON.stringify(schoolData.data));

      const embed = new EmbedBuilder()
        .setColor("Random")
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
      return ERROR.INVALID_ARGUMENT(interaction);
    }
  },
}
