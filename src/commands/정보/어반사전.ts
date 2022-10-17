import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("어반사전")
    .setDescription("인터넷 영어 오픈사전인 어반사전에서 단어를 검색합니다.")
    .addStringOption((option) => option
      .setName("단어")
      .setDescription("원하시는 단어를 입력해 주세요.")
      .setRequired(true)),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const word = interaction.options.getString("단어", true);

    try {
      let urbanDictionaryData: any = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
      urbanDictionaryData = JSON.parse(JSON.stringify(urbanDictionaryData.data));

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${urbanDictionaryData.list[0].word}`)
        .setURL(`${urbanDictionaryData.list[0].permalink}`)
        .setDescription(`${urbanDictionaryData.list[0].definition}`)
        .addFields(
          { name: "예문", value: `${urbanDictionaryData.list[0].example}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      interaction.followUp({ embeds: [embed] });

    } catch (error) {
      return ERROR.INVALID_ARGUMENT(client, interaction);
    }
  },
}