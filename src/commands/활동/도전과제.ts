import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mysql from "mysql";
import achievement from "../../achievement.json" assert { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("도전과제")
    .setDescription("여러 명령어들을 입력하고, 보고, 실행하며 도전과제들을 발견해보세요!"),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const connection = mysql.createConnection({
      host: `${process.env.MYSQL_HOST}`,
      user: "root",
      password: `${process.env.MYSQL_PASSWORD}`,
      database: "greenbot-database",
    });

    connection.query(`SELECT * FROM achievement WHERE id=${interaction.user.id}`, function(error, result) {
      if (result == "") {
        connection.query(`INSERT INTO achievement(ID, FirstStep) VALUES (${interaction.user.id}, 1)`)
        
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("⭐ 도전과제 획득!")
          .setDescription("'첫걸음' 도전과제를 획득하셨어요!\n\n획득 조건: 도전과제 명령어 사용\n도전과제 메뉴에 오신것을 환영합니다!")
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
        return interaction.followUp({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("⭐ 획득한 도전과제")
        .setDescription(`<@${interaction.user.id}>님이 획득하신 도전과제입니다.`)

      for (let i = 0; i < Object.keys(achievement).length; i++) {
        if (result[0][achievement[i].value] == 0) continue
        embed.addFields({ name: `${achievement[i].name}`, value: `${achievement[i].description}`, inline: true })
      }

      interaction.followUp({ embeds: [embed] });
    });
  },
};
