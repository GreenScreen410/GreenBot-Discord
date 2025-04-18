import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, version, time } from 'discord.js'
import os from 'os'

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setNameLocalizations({
      ko: '유저정보'
    })
    .setDescription('Shows the information of the user.')
    .setDescriptionLocalizations({
      ko: '해당 유저의 정보를 보여줍니다. 그린Bot의 정보를 요청할 경우 특별한 정보가 추가됩니다.'
    })
    .addUserOption((option) => option
      .setName('user')
      .setNameLocalizations({
        ko: '유저'
      })
      .setDescription('Select the user to check the information.')
      .setDescriptionLocalizations({
        ko: '정보를 확인할 유저를 선택해 주세요.'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const userInfo = interaction.options.getMember('user')
    if (userInfo == null) return

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${userInfo.user.tag}의 정보`)
      .setThumbnail(userInfo.user.displayAvatarURL(({ extension: 'png', size: 4096 })))
      .addFields(
        { name: '📛 이름', value: userInfo.user.username, inline: true },
        { name: '🆔 ID', value: userInfo.user.id, inline: true },
        { name: '🎂 계정 생성일', value: time(userInfo.user.createdAt), inline: true },
        { name: '📅 서버 가입일', value: userInfo.joinedTimestamp != null ? time(new Date(userInfo.joinedTimestamp)) : '알 수 없음', inline: true }
      )

    if (userInfo.user.id === process.env.BOT_ID) {
      embed.addFields(
        { name: '🖥️ OS', value: `${os.platform()} ${os.arch()}\n${os.release()}`, inline: true },
        { name: '💾 메모리 상태', value: `${(os.freemem() / 1024 ** 3).toFixed(2)}GB / ${(os.totalmem() / 1024 ** 3).toFixed(2)}GB`, inline: true },
        { name: '💻 CPU', value: os.cpus()[0].model, inline: true },
        { name: '📂 Node.js', value: process.version, inline: true },
        { name: '📦 discord.js', value: version, inline: true }
      )
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
