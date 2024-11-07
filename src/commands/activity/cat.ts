import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

interface CatImage {
  id: string
  url: string
  width: number
  height: number
}

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
    const { data: [response] } = await axios.get<CatImage[]>('https://api.thecatapi.com/v1/images/search', {
      headers: {
        'x-api-key': process.env.THE_CAT_API_KEY
      }
    })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(response.url)
      .setTitle('🐱')
      .setDescription(`사진 ID: [${response.id}](${response.url})`)
      .addFields(
        { name: '가로', value: `${response.width}px`, inline: true },
        { name: '세로', value: `${response.height}px`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}