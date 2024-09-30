import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
// @ts-expect-error no types
import { RockPaperScissors } from 'discord-gamecord'

export default {
  data: new SlashCommandBuilder()
    .setName('가위바위보')
    .setDescription('가위바위보')
    .addUserOption((option) => option
      .setName('유저')
      .setDescription('유저를 선택해 주세요.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const Game = new RockPaperScissors({
      reqTimeoutTime: 30000,
      requestMessage: '{player} 님이 가위바위보를 신청했습니다.\n30초 내 응답하지 않을 시, 취소 처리됩니다.',
      rejectMessage: '플레이어가 게임을 거절했습니다.',
      reqTimeoutMessage: '플레이어가 응답하지 않아 게임이 취소되었습니다.',

      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser('유저'),
      embed: {
        title: '가위 바위 보',
        color: 'Random',
        description: '버튼을 눌러 주세요.'
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
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      pickMessage: '{emoji}을(를) 고르셨습니다.',
      winMessage: '**{player}**님이(가) 승리하였습니다!',
      tieMessage: '비겼습니다!',
      timeoutMessage: '게임이 자동 종료되었습니다.',
      playerOnlyMessage: '{player}님와(과) {opponent}님만 버튼을 선택할 수 있습니다.'
    })

    Game.startGame()
  }
}
