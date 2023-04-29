import { Events, BaseInteraction } from "discord.js";
import chalk from "chalk";

export default {
  name: Events.InteractionCreate,

  async execute(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    await interaction.deferReply();

    if (!command) return interaction.client.error.INVALID_INTERACTION(interaction);
    try {
      await command.execute(interaction);
      console.log(chalk.white(`[COMMAND] ${interaction.guild.name}(${interaction.guild.id}) - ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
    } catch (error: any) {
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
