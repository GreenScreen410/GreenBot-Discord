import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('fox')
    .setNameLocalizations({
      ko: '여우'
    })
    .setDescription('Loads a random fox image.')
    .setDescriptionLocalizations({
      ko: '랜덤 여우 사진을 불러옵니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const response = await axios.get('https://randomfox.ca/floof/')

    const embed = new EmbedBuilder()
      .setImage(response.data.image as string)
      .setTitle('🦊')
    await interaction.followUp({ embeds: [embed] })
  }
}
