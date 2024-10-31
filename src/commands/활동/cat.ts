import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setNameLocalizations({
      ko: '고양이'
    })
    .setDescription('Loads a random cat picture.')
    .setDescriptionLocalizations({
      ko: '랜덤 고양이 사진을 불러옵니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
      headers: {
        'x-api-key': process.env.THE_CAT_API_KEY
      }
    })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(response.data[0].url as string)
      .setTitle('🐱')
    await interaction.followUp({ embeds: [embed] })
  }
}
