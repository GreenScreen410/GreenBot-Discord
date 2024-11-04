import { EmbedBuilder, Events, type Guild } from 'discord.js'

export default {
  name: Events.GuildCreate,

  async execute (guild: Guild) {
    guild.client.logger.info(`Invited to ${guild.name}(${guild.id})`)

    const embed = new EmbedBuilder()
      .setColor('#73C55C')
      .setTitle('초대해 주셔서 감사합니다! 🙇‍♂️')
      .setDescription(`그린Bot은 **${guild.client.guilds.cache.size}개의 서버, ${guild.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}명의 유저**와 함께 하고 있습니다!\n💌 링크: https://bit.ly/3TveLdR\n🆘 지원 서버: https://discord.gg/7znkdKNxm8\n🐱 깃허브: https://bit.ly/3z8JMfg`)

    await guild.systemChannel?.send({ embeds: [embed] })
  }
}
