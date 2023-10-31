import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import mysql from "mysql";
import achievements from "../achievements.json" assert { type: "json" };

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: "ubuntu",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const position: { [key: string]: [number, string] } = {};
for (let i = 0; i < Object.keys(achievements).length; i++) {
  position[achievements[i].id] = [i, achievements[i].name];
}

export default {
  GRANT: function (interaction: ChatInputCommandInteraction, name: string) {
    connection.query(`UPDATE achievements SET ${name}=1 WHERE id=${interaction.user.id}`, (error, result) => {
      if (result.message.includes("Changed: 0")) return;
      connection.end();

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("⭐ 도전과제 획득!")
        .setDescription(`'${position[name][1]}' 도전과제를 획득하셨어요!\n\n획득 조건: ${achievements[position[name][0]].condition}\n${achievements[position[name][0]].description}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
      interaction.followUp({ embeds: [embed] });

    })
  },
}