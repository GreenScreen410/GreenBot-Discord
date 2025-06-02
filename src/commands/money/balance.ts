import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setNameLocalizations({
      ko: '잔액'
    })
    .setDescription('Check the current balance.')
    .setDescriptionLocalizations({
      ko: '현재 잔액을 확인합니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const { money } = await interaction.client.mysql.query('SELECT money FROM activity WHERE id = ?', [interaction.user.id])
    const { win_money: winMoney } = await interaction.client.mysql.query('SELECT win_money FROM activity WHERE id = ?', [interaction.user.id])
    const { lose_money: loseMoney } = await interaction.client.mysql.query('SELECT lose_money FROM activity WHERE id = ?', [interaction.user.id])

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('💰 잔액')
      .setDescription(`현재 잔액: ${money.toLocaleString()}₩`)
      .addFields(
        { name: '💰 얻은 돈', value: `${winMoney.toLocaleString()}₩`, inline: true },
        { name: '💸 잃은 돈', value: `${loseMoney.toLocaleString()}₩`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
