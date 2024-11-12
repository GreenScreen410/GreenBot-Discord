import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

interface DogImage {
  id: string
  url: string
  width: number
  height: number
}

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
    const { data: [response] } = await axios.get<DogImage[]>('https://api.thedogapi.com/v1/images/search', {
      headers: {
        'x-api-key': process.env.THE_DOG_API_KEY
      }
    })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(response.url)
      .setTitle('🐶')
      .setDescription(`${await interaction.client.locale(interaction, 'command.dog.description')}: [${response.id}](${response.url})`)
      .addFields(
        { name: await interaction.client.locale(interaction, 'command.dog.width'), value: `${response.width}px`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.dog.height'), value: `${response.height}px`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
