import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } from "discord.js";
import "dotenv/config.js";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: `${process.env.MYSQL_HOST}`,
  user: "root",
  password: `${process.env.MYSQL_PASSWORD}`,
  database: "greenbot-database",
});

export default {
  data: new SlashCommandBuilder()
    .setName("순위표")
    .setDescription("[베타] 활동 순위표를 확인합니다.")
    .addStringOption(option => option
      .setName("종목")
      .setDescription("종목을 선택해 주세요.")
      .addChoices({ name: "국기퀴즈", value: "flag-quiz" })
      .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const activity = interaction.options.getString("종목");

    if (activity === "flag-quiz") {
      connection.query(`SELECT * FROM activity ORDER BY flag_quiz DESC`, function (error, result) {
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("🏆 국기퀴즈 순위표")
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

        for (let i = 0; i < result.length; i++) {
          embed.addFields({ name: `${i + 1}위`, value: `<@${result[i].id}>: ${result[i].flag_quiz}점` });
        }

        interaction.followUp({ embeds: [embed] });
      });
    }
  }
}