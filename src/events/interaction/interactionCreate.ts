import { Events, BaseInteraction } from "discord.js";
import mysql from "mysql";
import chalk from "chalk";

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: "ubuntu",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const today = new Date();

const year = today.getFullYear();
const month = ('0' + (today.getMonth() + 1)).slice(-2);
const day = ('0' + today.getDate()).slice(-2);

const dateString = year + '-' + month + '-' + day;
const hours = ('0' + today.getHours()).slice(-2);
const minutes = ('0' + today.getMinutes()).slice(-2);
const seconds = ('0' + today.getSeconds()).slice(-2);

const timeString = hours + ':' + minutes + ':' + seconds;

console.log(dateString, timeString);

export default {
  name: Events.InteractionCreate,

  async execute(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    await interaction.deferReply();

    if (!command) return interaction.client.error.INVALID_INTERACTION(interaction);
    console.log(chalk.white(`${dateString} ${timeString} - [COMMAND] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))

    try {
      connection.query(`SELECT * FROM user WHERE id=${interaction.user.id}`, function (error, result) {
        if (result == "") {
          command.execute(interaction);
          console.log(chalk.white(`${dateString} ${timeString} - [COMMAND] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
        } else if (result[0].banned) {
          return interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction);
        }
      });
    } catch (error: unknown) {
      return interaction.client.error.UNKNOWN_ERROR(interaction, error);
    }
  }
}
