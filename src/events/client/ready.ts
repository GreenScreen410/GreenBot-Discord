import { Events, type Client, ActivityType } from 'discord.js'
import logger from '../../handler/logger.js'

export default {
  name: Events.ClientReady,
  once: true,

  async execute (client: Client<true>) {
    client.lavalink.init({ id: client.user.id, username: 'GreenBot' }).catch((error) => {
      logger.error('Lavalink connection error: ', error)
    })

    logger.info(`${client.user?.tag} is up and ready to go!`)

    const promises = [
      client.shard?.fetchClientValues('guilds.cache.size'),
      client.shard?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    ]

    await Promise.all(promises).then(async (results: any) => {
      const totalGuilds = results[0].reduce((acc: any, guildCount: any) => acc + guildCount, 0)
      const totalMembers = results[1].reduce((acc: any, memberCount: any) => acc + memberCount, 0)

      const activities = process.env.NODE_ENV === 'production'
        ? [
        `${totalGuilds}개의 서버에서 활동`,
        `${totalMembers}명의 유저와 활동`
          ]
        : ['이 봇이 켜져 있다면, 개발자가 일하고 있는겁니다.']

      setInterval(() => {
        const index = Math.floor(Math.random() * activities.length)
        client.user?.setActivity({ name: `${activities[index]}`, type: ActivityType.Playing })
      }, 3000)
    })
  }
}
