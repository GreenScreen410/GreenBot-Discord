import { type ChatInputCommandInteraction, type ButtonInteraction, EmbedBuilder } from 'discord.js'

async function createErrorEmbed (interaction: ChatInputCommandInteraction | ButtonInteraction, errorCode: string, description: string): Promise<EmbedBuilder> {
  const title = await interaction.client.i18n(interaction, 'error.title')
  const codeLabel = await interaction.client.i18n(interaction, 'error.code')
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(title)
    .setDescription(description)
    .setFields({ name: codeLabel, value: errorCode })
}

export default {
  NO_PERMISSION: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, permission: any) {
    const description = await interaction.client.i18n(interaction, 'error.no_permission') + `\n\`\`\`ts\n${permission}\`\`\``
    const embed = await createErrorEmbed(interaction, 'NO_PERMISSION', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  YOU_HAVE_BEEN_BANNED: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, reason: any) {
    const description = await interaction.client.i18n(interaction, 'error.you_have_been_banned', { reason })
    const embed = await createErrorEmbed(interaction, 'YOU_HAVE_BEEN_BANNED', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  UNKNOWN_ERROR: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, error: any) {
    const description = `알 수 없는 오류가 발생하였습니다.\n\`\`\`ts\n${error.message}\`\`\``
    const embed = await createErrorEmbed(interaction, 'UNKNOWN_ERROR', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  INVALID_INTERACTION: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '올바르지 않은 명령입니다.'
    const embed = await createErrorEmbed(interaction, 'INVALID_INTERACTION', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  INVALID_ARGUMENT: async function (interaction: ChatInputCommandInteraction | ButtonInteraction, argument?: string | number) {
    const description = `잘못된 인자입니다: \`${argument}\``
    const embed = await createErrorEmbed(interaction, 'INVALID_ARGUMENT', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  PLEASE_JOIN_VOICE_CHANNEL: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '먼저 음성 채널에 접속해 주세요.'
    const embed = await createErrorEmbed(interaction, 'PLEASE_JOIN_VOICE_CHANNEL', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  PLEASE_JOIN_SAME_VOICE_CHANNEL: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '같은 음성 채널에 접속해 주세요.'
    const embed = await createErrorEmbed(interaction, 'PLEASE_JOIN_SAME_VOICE_CHANNEL', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_QUEUE_IS_EMPTY: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '재생중인 음악이 없습니다.'
    const embed = await createErrorEmbed(interaction, 'MUSIC_QUEUE_IS_EMPTY', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_IS_TOO_LONG: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '5시간 이하의 음악만 재생할 수 있습니다.'
    const embed = await createErrorEmbed(interaction, 'MUSIC_IS_TOO_LONG', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  MUSIC_SERVER_RESTARTED: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '음악 서버가 재시작되었습니다. 다시 시도해 주세요.'
    const embed = await createErrorEmbed(interaction, 'MUSIC_SERVER_RESTARTING', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  CAN_NOT_USE_IN_DM: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = 'DM에서는 사용하실 수 없는 명령어입니다.'
    const embed = await createErrorEmbed(interaction, 'CAN_NOT_USE_IN_DM', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  ALLOWANCE_ONCE_A_DAY: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '하루에 한 번만 받을 수 있습니다.'
    const embed = await createErrorEmbed(interaction, 'ALLOWANCE_ONCE_A_DAY', description)
    return await interaction.followUp({ embeds: [embed] })
  },

  CAN_NOT_AFFORD: async function (interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const description = '가지고 있는 돈보다 많은 금액을 걸 수 없습니다.\n한국도박문제예방치유원: 📞 1336'
    const embed = await createErrorEmbed(interaction, 'CAN_NOT_AFFORD', description)
    return await interaction.followUp({ embeds: [embed] })
  }
}
