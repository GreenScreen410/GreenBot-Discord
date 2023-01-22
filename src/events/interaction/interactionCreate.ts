import { BaseInteraction } from "discord.js";
import mysql from "mysql";
import chalk from "chalk";
import client from "../../index.js"
import ERROR from "../../handler/ERROR.js";

const connection = mysql.createConnection({
  host: `${process.env.MYSQL_HOST}`,
  user: "root",
  password: `${process.env.MYSQL_PASSWORD}`,
  database: "greenbot-database",
});

client.on("interactionCreate", async (interaction: BaseInteraction) => {
  if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

  const command = client.commands.get(interaction.commandName);
  await interaction.deferReply();

  if (!command) {
    return ERROR.INVALID_INTERACTION(interaction);
  } else {
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
  }
});