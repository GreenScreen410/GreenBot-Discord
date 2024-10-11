import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, version } from 'discord.js'
import os from 'os'

export default {
  data: new SlashCommandBuilder()
    .setName('유저정보')
    .setDescription('해당 유저의 정보를 보여줍니다. 그린Bot의 정보를 요청할 경우 특별한 정보가 추가됩니다.')
    .addUserOption((option) => option
      .setName('유저')
      .setDescription('유저를 선택해 주세요.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const userInfo = interaction.options.getMember('유저')
    if (userInfo == null) return

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${userInfo.user.tag}의 정보`)
      .setThumbnail(userInfo.user.displayAvatarURL())
      .addFields(
        { name: '📛 이름', value: userInfo.user.username, inline: true },
        { name: '🆔 ID', value: userInfo.user.id, inline: true },
        { name: '🎂 계정 생성일', value: userInfo.user.createdAt.toLocaleString(), inline: true },
        { name: '📅 서버 가입일', value: userInfo.joinedTimestamp != null ? new Date(userInfo.joinedTimestamp).toLocaleString() : '알 수 없음', inline: true }
      )

    if (userInfo.user.id === '767371161083314236') {
      embed.addFields(
        { name: '🖥️ OS', value: `${os.type()} ${os.version()} ${os.release()}`, inline: true },
        { name: '💾 메모리 상태', value: `${Math.round(os.freemem() / 1000000)} MB/${Math.round(os.totalmem() / 1000000)} MB`, inline: true },
        { name: '📂 node.js 버전', value: process.version, inline: true },
        { name: '📂 discord.js 버전', value: version, inline: true }
      )
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
