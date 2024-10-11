import mysql from 'mysql2/promise'

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: 'ubuntu',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  enableKeepAlive: true
})

export default {
  register: async function (interaction: any) {
    await connection.query(`INSERT INTO user VALUES (${interaction.user.id}, 0, '', 0)`)
    await connection.query(`INSERT INTO activity VALUES (${interaction.user.id}, 0, 0)`)
  },

  query: async function (query: string) {
    const [rows]: any = await connection.query(query)
    return rows[0]
  }
}
