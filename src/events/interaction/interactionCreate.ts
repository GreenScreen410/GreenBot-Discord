import { Events, BaseInteraction } from "discord.js";
import mysql from "mysql";
import chalk from "chalk";

const connection = mysql.createConnection({
  host: `${process.env.MYSQL_HOST}`,
  user: "root",
  password: `${process.env.MYSQL_PASSWORD}`,
  database: "greenbot-database",
});

var today = new Date();

var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);

var dateString = year + '-' + month + '-' + day;
var hours = ('0' + today.getHours()).slice(-2);
var minutes = ('0' + today.getMinutes()).slice(-2);
var seconds = ('0' + today.getSeconds()).slice(-2);

var timeString = hours + ':' + minutes + ':' + seconds;

console.log(dateString, timeString);

export default {
  name: Events.InteractionCreate,

  async execute(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    await interaction.deferReply();

    if (!command) return interaction.client.error.INVALID_INTERACTION(interaction);
    try {
      connection.query(`SELECT * FROM user WHERE id=${interaction.user.id}`, function (error, result) {
        if (result[0].banned) {
          return interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction);
        } else {
          command.execute(interaction);
          console.log(chalk.white(`${dateString} ${timeString} - [COMMAND] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
        }
      });
    } catch (error: any) {
      console.log(error);
      return interaction.client.error.UNKNOWN_ERROR(interaction, error);
    }

    /*
    import mysql from "mysql";
  
    const connection = mysql.createConnection({
      host: `${process.env.MYSQL_HOST}`,
      user: "root",
      password: `${process.env.MYSQL_PASSWORD}`,
      database: "greenbot-database",
    });
  
    if (command.permission && command.permission.length > 0) {
      if (!interaction.guild.members.me?.permissions.has(command.permission)) {
        const permissionList = new PermissionsBitField(command.permission).toArray()
        return ERROR.BOT_HAVE_NO_PERMISSION(interaction, permissionList);
      }
    }
  
    connection.query(`SELECT * FROM ban WHERE ID=${interaction.user.id}`, function (error, result) {
      try {
        if (result[0].ban == 1) {
          return ERROR.YOU_HAVE_BEEN_BANNED(interaction);
        }
      }
      catch (error) {
        command.run(client, interaction);
        console.log(chalk.white(`[COMMAND] ${interaction.guild.name}(${interaction.guild.id}) - ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
      }
    });
    */
  }
}
