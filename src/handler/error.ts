import { type ChatInputCommandInteraction, type ButtonInteraction, EmbedBuilder } from 'discord.js'

export default {
  NO_PERMISSION: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, reason: string) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('권한이 없습니다.')
      .setFields({ name: '에러 코드', value: 'NO_PERMISSION' })
    return await interaction.followUp({ embeds: [embed] })
  },

  YOU_HAVE_BEEN_BANNED: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, reason: string) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription(`관리자로부터 차단당하였습니다.\n사유: \`${reason}\``)
      .setFields({ name: '에러 코드', value: 'YOU_HAVE_BEEN_BANNED' })
    return await interaction.followUp({ embeds: [embed] })
  },

  UNKNOWN_ERROR: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, error: any) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription(`알 수 없는 오류가 발생하였습니다.\n\`\`\`ts\n${error.message}\`\`\``)
      .addFields({ name: '에러 코드', value: 'UNKNOWN_ERROR' })
    await interaction.client.users.cache.get('332840377763758082')?.send(`${error.stack}`)
    return await interaction.followUp({ embeds: [embed] })
  },

  INVALID_INTERACTION: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('올바르지 않은 명령입니다.')
      .addFields({ name: '에러 코드', value: 'INVALID_INTERACTION' })
    return await interaction.followUp({ embeds: [embed] })
  },

  INVALID_ARGUMENT: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, argument?: string | number) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription(`잘못된 인자입니다: \`${argument}\``)
      .addFields({ name: '에러 코드', value: 'INVALID_ARGUMENT' })
    return await interaction.followUp({ embeds: [embed] })
  },

  PLEASE_JOIN_VOICE_CHANNEL: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('먼저 음성 채널에 접속해 주세요.')
      .addFields({ name: '에러 코드', value: 'PLEASE_JOIN_VOICE_CHANNEL' })
    return await interaction.followUp({ embeds: [embed] })
  },

  PLEASE_JOIN_SAME_VOICE_CHANNEL: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('같은 음성 채널에 접속해 주세요.')
      .addFields({ name: '에러 코드', value: 'PLEASE_JOIN_SAME_VOICE_CHANNEL' })
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_QUEUE_IS_EMPTY: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('재생중인 노래가 없습니다.')
      .addFields({ name: '에러 코드', value: 'MUSIC_QUEUE_IS_EMPTY' })
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_IS_TOO_LONG: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('5시간 이하의 노래만 재생할 수 있습니다.')
      .addFields({ name: '에러 코드', value: 'MUSIC_IS_TOO_LONG' })
    return await interaction.followUp({ embeds: [embed] })
  },

  CAN_NOT_USE_IN_DM: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 오류!')
      .setDescription('DM에서는 사용하실 수 없는 명령어입니다.')
      .addFields({ name: '에러 코드', value: 'CAN_NOT_USE_IN_DM' })
    return await interaction.followUp({ embeds: [embed] })
  }
}
