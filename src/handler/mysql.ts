import mysql from 'mysql2/promise'
import logger from '../handler/logger.js'

const connection = mysql.createPool({
  host: process.env.SERVER_IP,
  user: 'ubuntu',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  enableKeepAlive: true
})

export default {
  register: async function (interaction: any) {
    await connection.query(`INSERT INTO user VALUES (${interaction.user.id}, 0, '', 0, '')`)
    logger.info(`[MySQL] ${interaction.user.tag}(${interaction.user.id}) has been registered.`)
  },

  query: async function (query: string, values: any) {
    const [rows]: any = await connection.query(query, values)
    if (rows.length === 1) return rows[0]
    else return rows
  }
}
