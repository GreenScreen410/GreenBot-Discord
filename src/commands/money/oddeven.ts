import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('oddeven')
    .setNameLocalizations({
      ko: '홀짝'
    })
    .setDescription('Randomly pick a number between 1 and 100. If you guess odd/even, you will get double the amount.')
    .setDescriptionLocalizations({
      ko: '1부터 100까지의 랜덤한 숫자를 뽑습니다. 홀/짝을 맞추면 2배의 금액을 얻습니다.'
    })
    .addIntegerOption(option => option
      .setName('money')
      .setNameLocalizations({
        ko: '금액'
      })
      .setDescription('The amount of money you want to gamble.')
      .setDescriptionLocalizations({
        ko: '도박할 금액을 입력하세요.'
      })
      .setMinValue(1)
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('result')
      .setNameLocalizations({
        ko: '결과'
      })
      .setDescription('Choose between odd and even.')
      .setDescriptionLocalizations({
        ko: '홀/짝을 선택하세요.'
      })
      .addChoices({
        name: 'Odd',
        name_localizations: {
          ko: '홀'
        },
        value: 'odd'
      })
      .addChoices({
        name: 'Even',
        name_localizations: {
          ko: '짝'
        },
        value: 'even'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const { money } = await interaction.client.mysql.query('SELECT money FROM activity WHERE id = ?', [interaction.user.id])
    const betting = interaction.options.getInteger('money', true)
    const userChoice = interaction.options.getString('result')

    if (money < betting) {
      return await interaction.client.error.CAN_NOT_AFFORD(interaction)
    }

    const randomNumber = Math.floor(Math.random() * 100) + 1
    const gameResult = randomNumber % 2 === 0 ? 'even' : 'odd'
    const isWin = gameResult === userChoice

    const reward = isWin ? betting : -betting
    const newBalance = money + reward

    await interaction.client.mysql.query('UPDATE activity SET money = ? WHERE id = ?', [newBalance, interaction.user.id])
    await interaction.client.mysql.query('UPDATE activity SET win_money = win_money + ? WHERE id = ?', [isWin ? betting : 0, interaction.user.id])
    await interaction.client.mysql.query('UPDATE activity SET lose_money = lose_money + ? WHERE id = ?', [isWin ? 0 : betting, interaction.user.id])

    const embed = new EmbedBuilder()
      .setColor(isWin ? 'Green' : 'Red')
      .setTitle(await interaction.client.locale(interaction, 'command.oddeven.title'))
      .setDescription(await interaction.client.locale(interaction, 'command.oddeven.description', { betting: betting.toLocaleString(), choice: userChoice === 'odd' ? await interaction.client.locale(interaction, 'command.oddeven.odd') : await interaction.client.locale(interaction, 'command.oddeven.even') }))
      .addFields(
        { name: await interaction.client.locale(interaction, 'command.oddeven.number'), value: `${randomNumber} (${gameResult === 'odd' ? await interaction.client.locale(interaction, 'command.oddeven.odd') : await interaction.client.locale(interaction, 'command.oddeven.even')})`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.oddeven.result'), value: isWin ? await interaction.client.locale(interaction, 'command.oddeven.win') : await interaction.client.locale(interaction, 'command.oddeven.lose'), inline: true },
        { name: await interaction.client.locale(interaction, 'command.oddeven.balance'), value: `${newBalance.toLocaleString()}₩ (${isWin ? '+' : '-'} ${betting.toLocaleString()}₩)`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
