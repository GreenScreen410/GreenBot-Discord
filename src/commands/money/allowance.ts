import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('allowance')
    .setNameLocalizations({
      ko: '용돈'
    })
    .setDescription('Receive an allowance. You can receive it once a day.')
    .setDescriptionLocalizations({
      ko: '용돈을 받습니다. 하루에 한 번 받을 수 있습니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const { last_claim: lastClaim } = await interaction.client.mysql.query('SELECT last_claim FROM activity WHERE id = ?', [interaction.user.id])
    const lastClaimDate = new Date(lastClaim as Date)
    const currentDate = new Date()

    if (lastClaimDate.getTime() + 86400000 > currentDate.getTime()) {
      return interaction.client.error.ALLOWANCE_ONCE_A_DAY(interaction)
    }

    await interaction.client.mysql.query('UPDATE activity SET money = money + 1000 WHERE id = ?', [interaction.user.id])
    await interaction.client.mysql.query('UPDATE activity SET last_claim = ? WHERE id = ?', [currentDate, interaction.user.id])

    const { money } = await interaction.client.mysql.query('SELECT money FROM activity WHERE id = ?', [interaction.user.id])
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🏦 용돈')
      .setDescription(`1,000₩을 받았습니다.\n현재 잔액: ${money.toLocaleString()}₩`)
    await interaction.followUp({ embeds: [embed] })
  }
}
