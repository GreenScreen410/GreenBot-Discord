import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
// @ts-expect-error no types
import { RockPaperScissors } from 'discord-gamecord'

export default {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setNameLocalizations({
      ko: '가위바위보'
    })
    .setDescription('Play rock paper scissors with a user.')
    .setDescriptionLocalizations({
      ko: '가위바위보를 합니다.'
    })
    .addUserOption((option) => option
      .setName('user')
      .setNameLocalizations({
        ko: '유저'
      })
      .setDescription('Select a user to play rock paper scissors with.')
      .setDescriptionLocalizations({
        ko: '가위바위보를 할 유저를 선택해 주세요.'
      })
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const opponent = interaction.options.getUser('user', true)
    if (interaction.user.id === opponent.id) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, '자기 자신과 가위바위보를 할 수 없습니다.')
    }
    if (opponent.bot) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, '봇과 가위바위보를 할 수 없습니다.')
    }

    const player1 = await interaction.client.mysql.query('SELECT rps FROM activity WHERE id = ?', [interaction.user.id])
    let player2: any = ''
    try {
      player2 = await interaction.client.mysql.query('SELECT rps FROM activity WHERE id = ?', [opponent.id])
      player2 = `${opponent.username}: ${player2.rps + 1}승`
    } catch (error) {
      player2 = `${opponent.username}: (그린Bot을 사용한 적이 없는 유저입니다. 점수가 반영되지 않습니다.)`
    }

    const Game = new RockPaperScissors({
      reqTimeoutTime: 30000,
      requestMessage: '{player}님이 가위바위보를 신청했습니다.\n30초 내 응답하지 않을 시, 취소 처리됩니다.',
      rejectMessage: '플레이어가 게임을 거절했습니다.',
      reqTimeoutMessage: '플레이어가 응답하지 않아 게임이 취소되었습니다.',
      message: interaction,
      isSlashGame: true,
      opponent,
      embed: {
        title: '가위 바위 보',
        color: 'Random',
        description: '버튼을 눌러 주세요.\n10초 내 응답하지 않을 시, 취소 처리됩니다.'
      },
      buttons: {
        rock: '바위',
        paper: '보',
        scissors: '가위',
        accept: '수락',
        reject: '거절'
      },
      emojis: {
        rock: '🪨',
        paper: '📰',
        scissors: '✂️'
      },
      mentionUser: true,
      timeoutTime: 10000,
      buttonStyle: 'PRIMARY',
      pickMessage: '{emoji}을(를) 고르셨습니다.',
      winMessage: `**{player}**님이(가) 승리하였습니다!\n${interaction.user.username}: ${player1.rps + 1}승\n${player2}`,
      tieMessage: `비겼습니다!\n\n${interaction.user.username}: ${player1.rps + 1}승\n${player2}`,
      timeoutMessage: '10초가 지나 게임이 자동 종료되었습니다.',
      playerOnlyMessage: '{player}님와(과) {opponent}님만 버튼을 선택할 수 있습니다.'
    })

    Game.startGame()

    Game.on('gameOver', async (result: Record<string, string>) => {
      if (result.result === 'win') {
        return await interaction.client.mysql.query('UPDATE activity SET rps = rps + 1 WHERE id = ?', [interaction.user.id])
      }
    })
  }
}
