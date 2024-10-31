import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setNameLocalizations({
      ko: '강아지'
    })
    .setDescription('Loads a random dog picture.')
    .setDescriptionLocalizations({
      ko: '랜덤 강아지 사진을 불러옵니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const response = await axios.get('https://api.thedogapi.com/v1/images/search', {
      headers: {
        'x-api-key': process.env.THE_DOG_API_KEY
      }
    })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(response.data[0].url as string)
      .setTitle('🐶')
    await interaction.followUp({ embeds: [embed] })
  }
}
