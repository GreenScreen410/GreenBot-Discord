import { type Track, type Player, type TrackExceptionEvent } from 'lavalink-client/dist/types'
import { exec } from 'child_process'
import { promisify } from 'util'
import logger from '../../handler/logger.js'

let index = 0
const execAsync = promisify(exec)

export default {
  name: 'trackError',

  async execute (player: Player, track: Track, payload: TrackExceptionEvent) {
    if (payload.exception?.message === 'This content isn’t available.') {
      const { stdout } = await execAsync('sudo cat /root/token')
      const tokens = stdout.trim().split('\n')
      index = (index + 1) % tokens.length

      await execAsync(`sudo su -c "sed -i '11s#refreshToken:.*#refreshToken: \\"${tokens[index]}\\"#' /root/application.yml"`)
      await execAsync('sudo su -c "pm2 restart "Lavalink Server"')
      await execAsync('pm2 restart index')

      logger.info('Lavalink token expired, refreshing...')
    }
  }
}
