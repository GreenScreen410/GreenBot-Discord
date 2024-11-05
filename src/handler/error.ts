import { type ChatInputCommandInteraction, type ButtonInteraction, EmbedBuilder } from 'discord.js'

export default {
  NO_PERMISSION: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription(await interaction.client.locale(interaction, 'error.no_permission'))
      .setFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'NO_PERMISSION' })
    return await interaction.followUp({ embeds: [embed] })
  },

  YOU_HAVE_BEEN_BANNED: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, reason: any) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription(await interaction.client.locale(interaction, 'error.you_have_been_banned', { reason }))
      .setFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'YOU_HAVE_BEEN_BANNED' })
    return await interaction.followUp({ embeds: [embed] })
  },

  UNKNOWN_ERROR: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, error: any) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription(`알 수 없는 오류가 발생하였습니다.\n\`\`\`ts\n${error.message}\`\`\``)
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'UNKNOWN_ERROR' })
    await interaction.client.users.cache.get('332840377763758082')?.send(`${error.stack}`)
    return await interaction.followUp({ embeds: [embed] })
  },

  INVALID_INTERACTION: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription('올바르지 않은 명령입니다.')
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'INVALID_INTERACTION' })
    return await interaction.followUp({ embeds: [embed] })
  },

  INVALID_ARGUMENT: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, argument?: string | number) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription(`잘못된 인자입니다: \`${argument}\``)
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'INVALID_ARGUMENT' })
    return await interaction.followUp({ embeds: [embed] })
  },

  PLEASE_JOIN_VOICE_CHANNEL: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription('먼저 음성 채널에 접속해 주세요.')
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'PLEASE_JOIN_VOICE_CHANNEL' })
    return await interaction.followUp({ embeds: [embed] })
  },

  PLEASE_JOIN_SAME_VOICE_CHANNEL: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription('같은 음성 채널에 접속해 주세요.')
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'PLEASE_JOIN_SAME_VOICE_CHANNEL' })
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_QUEUE_IS_EMPTY: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription('재생중인 음악이 없습니다.')
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'MUSIC_QUEUE_IS_EMPTY' })
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_IS_TOO_LONG: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription('5시간 이하의 음악만 재생할 수 있습니다.')
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'MUSIC_IS_TOO_LONG' })
    return await interaction.followUp({ embeds: [embed] })
  },

  CAN_NOT_USE_IN_DM: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(await interaction.client.locale(interaction, 'error.title'))
      .setDescription('DM에서는 사용하실 수 없는 명령어입니다.')
      .addFields({ name: await interaction.client.locale(interaction, 'error.code'), value: 'CAN_NOT_USE_IN_DM' })
    return await interaction.followUp({ embeds: [embed] })
  }
}
