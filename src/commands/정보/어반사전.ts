import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('어반사전')
    .setDescription('인터넷 영어 오픈사전인 어반사전에서 단어를 검색합니다.')
    .addStringOption((option) => option
      .setName('단어')
      .setDescription('원하시는 단어를 입력해 주세요.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString('단어', true)
    const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`)
    if (response.data.list[0] == null) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, word)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${response.data.list[0].word}`)
      .setURL(`${response.data.list[0].permalink}`)
      .setDescription(`${response.data.list[0].definition.slice(0, 1021)}...`)
      .addFields({ name: '예문', value: `${response.data.list[0].example.slice(0, 1021)}...`, inline: true })
    await interaction.followUp({ embeds: [embed] })
  }
}
