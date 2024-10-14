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
    // await connection.query(`INSERT INTO activity VALUES (${interaction.user.id}, 0, 0)`)
    console.log(`[MySQL] ${interaction.user.tag}(${interaction.user.id}) has been registered.`)
  },

  query: async function (query: string) {
    const [rows]: any = await connection.query(query)

    if (rows.length === 1) {
      return rows[0]
    } else {
      return rows
    }
  }
}
