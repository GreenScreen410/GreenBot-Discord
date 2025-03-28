import { Events, type Client, ActivityType } from 'discord.js'

export default {
  name: Events.ClientReady,
  once: true,

  async execute (client: Client) {
    client.logger.info(`${client.user?.tag} is up and ready to go!`)

    const activities = process.env.NODE_ENV === 'production'
      ? [
        `${client.guilds.cache.size}개의 서버에서 활동`,
        `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}명의 유저와 활동`
        ]
      : ['이 봇이 켜져 있다면, 개발자가 일하고 있는겁니다.']

    setInterval(() => {
      const index = Math.floor(Math.random() * activities.length)
      client.user?.setActivity({ name: `${activities[index]}`, type: ActivityType.Playing })
    }, 3000)
  }
}
