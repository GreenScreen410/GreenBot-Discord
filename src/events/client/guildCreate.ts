import { EmbedBuilder, Events, type Guild } from 'discord.js'

export default {
  name: Events.GuildCreate,

  async execute (guild: Guild) {
    guild.client.logger.info(`Invited to ${guild.name}(${guild.id}), ${guild.memberCount} members`)

    const serversCount = guild.client.guilds.cache.size
    const totalMembers = guild.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)

    const embed = new EmbedBuilder()
      .setColor('#73C55C')
      .setTitle('초대해 주셔서 감사합니다! 🙇‍♂️')
      .setDescription(`그린Bot은 **${serversCount}개의 서버, ${totalMembers}명의 유저**와 함께 하고 있습니다!`)
      .addFields(
        { name: '💌 링크', value: '[한국 디스코드 리스트](https://bit.ly/3TveLdR)', inline: true },
        { name: '🆘 지원 서버', value: '[디스코드 지원 서버](https://discord.gg/7znkdKNxm8)', inline: true },
        { name: '🐱 깃허브', value: '[깃허브 링크](https://bit.ly/3z8JMfg)', inline: true }
      )
      .setFooter({ text: '/언어 명령어로 언어를 변경할 수 있습니다.\nYou can change the language with the /language command.' })

    await guild.systemChannel?.send({ embeds: [embed] })
  }
}
