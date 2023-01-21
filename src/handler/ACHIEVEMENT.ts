import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import mysql from "mysql";
import achievement from "../achievement.json" assert { type: "json" };
import ERROR from "./ERROR.js";

const connection = mysql.createConnection({
  host: `${process.env.MYSQL_HOST}`,
  user: "root",
  password: `${process.env.MYSQL_PASSWORD}`,
  database: "greenbot-database",
});

const Columns = {
  FirstStep: 0,
  Debugger: 1,
  DJ: 2,
  RuinTheFun: 3,
  CheckSchoolInfo: 4
};

export default {
  GRANT: function (interaction: ChatInputCommandInteraction, name: any) {
    // @ts-ignore
    const position = Columns[name];

    connection.query(`UPDATE achievement SET ${achievement[position].value}=1 WHERE id=${interaction.user.id}`, (error, result) => {
      if (result.message.includes("Changed: 0")) return;

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("⭐ 도전과제 획득!")
        .setDescription(`'${(achievement[position].name).split(" ")[1]}' 도전과제를 획득하셨어요!\n\n획득 조건: ${achievement[position].condition}\n${achievement[position].description}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      return interaction.followUp({ embeds: [embed] });
    })
  },

  REVOKE: function (interaction: ChatInputCommandInteraction, name: any) {
    if (interaction.user.id == "332840377763758082") return ERROR.NO_PERMISSION(interaction);

    const embed = new EmbedBuilder();

    return interaction.followUp({ embeds: [embed] })
  }
}
