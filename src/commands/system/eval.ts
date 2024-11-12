import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { createRequire } from 'module'

export default {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate the JavaScript code.')
    .setDescriptionLocalizations({
      ko: 'JavaScript 코드를 실행합니다.'
    })
    .addStringOption(option => option
      .setName('code')
      .setNameLocalizations({
        ko: '코드'
      })
      .setDescription('The JavaScript code you want to evaluate.')
      .setDescriptionLocalizations({
        ko: '실행할 JavaScript 코드를 입력하세요.'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    if (interaction.user.id !== process.env.ADMIN_ID) {
      return await interaction.client.error.NO_PERMISSION(interaction)
    }

    const code = interaction.options.getString('code', true)

    let output
    try {
      // eslint-disable-next-line
      const require = createRequire(import.meta.url)
      // eslint-disable-next-line
      output = await eval(code).toString()
    } catch (error: any) {
      output = error.stack.toString()
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Eval')
      .setDescription('```js\n' + output.toString().slice(0, 2048) + '```')
    await interaction.followUp({ embeds: [embed] })
  }
}
