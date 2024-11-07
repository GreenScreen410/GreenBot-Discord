import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } from 'discord.js'
import dayjs from 'dayjs'

export default {
  data: new SlashCommandBuilder()
    .setName('statistics')
    .setNameLocalizations({
      ko: '통계'
    })
    .setDescription('Shows overall statistics of the bot.')
    .setDescriptionLocalizations({
      ko: '봇의 전체적인 통계를 보여줍니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.statistics.title'))
      .setDescription(time(dayjs().unix()))
      .addFields(
        { name: await interaction.client.locale(interaction, 'command.statistics.server'), value: `${interaction.client.guilds.cache.size}개`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.user'), value: `${interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}명`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.unique_user'), value: `${(await interaction.client.mysql.query('SELECT COUNT(*) FROM user', []))['COUNT(*)']}명`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.channel'), value: `${interaction.client.channels.cache.size}개`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.command'), value: `${interaction.client.commands.size}개`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.execute'), value: `${(await interaction.client.mysql.query('SELECT count FROM statistics WHERE event = "total_command"', [])).count}회`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.uptime'), value: `${time(dayjs().unix() - Math.floor(interaction.client.uptime / 1000), TimestampStyles.RelativeTime)}`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.banned'), value: `${(await interaction.client.mysql.query('SELECT COUNT(*) FROM user WHERE banned = 1', []))['COUNT(*)']}명`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.music'), value: `${interaction.client.lavalink.players.size}개`, inline: true },
        { name: await interaction.client.locale(interaction, 'command.statistics.most_command_user'), value: `<@${(await interaction.client.mysql.query('SELECT id FROM user ORDER BY count DESC LIMIT 1', [])).id}>` }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
