import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mysql from "mysql";

export default {
  data: new SlashCommandBuilder()
    .setName("도전과제")
    .setDescription("여러 명령어들을 입력하고, 보고, 실행하며 도전과제들을 발견해보세요!"),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const achievements = [
      {
        "value": "firstStep",
        "name": "첫걸음",
        "description": "도전과제 메뉴에 오신것을 환영합니다!",
        "condition": "도전과제 명령어 사용"
      },

      {
        "value": "debugger",
        "name": "디버거",
        "description": "오늘도 개발자는 일합니다...",
        "condition": "예상치 못한(Unexpected) 오류 일으키기"
      }
    ]

    // DJ, 평범한 음악에는 만족하지 못하시는군요.
    // 음악 필터를 10번 입력했을 경우 달성

    // 첫걸음, 명령어를 처음 사용하셨군요!
    // 아무 명령어 처음 사용

    // 디버거, 오늘도 개발자는 일합니다...
    // 그린Bot에 예상하지 못한(Unexpected) 오류 일으키기

    // 학생, 내가 다니는 학교의 정보는 어떨까?
    // 학교정보 명령어 사용

    const connection = mysql.createConnection({
      host: "34.70.130.162",
      user: "root",
      password: "paul2481!",
      database: "greenbot-database",
    });

    connection.query(`SELECT * FROM achievement WHERE id=${interaction.user.id}`, function(error, result) {
      if (result == "") { // DB에 사용자 ID가 없을 때
        connection.query(`INSERT INTO achievement VALUES (${interaction.user.id}, 1, 0)`)
        
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("⭐ 도전과제 획득!")
          .setDescription("'첫걸음' 도전과제를 획득하셨어요!\n\n획득 조건: 도전과제 명령어 사용\n도전과제 메뉴에 오신것을 환영합니다!")
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
        return interaction.followUp({ embeds: [embed], ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("⭐ 획득한 도전과제")
        .setDescription(`<@${interaction.user.id}>님이 획득하신 도전과제입니다.`)

      for (let i = 0; i < 2; i++) {
        if (result[0][achievements[i].value] == 0) continue
        embed.addFields({ name: `${achievements[i].name}`, value: `${achievements[i].condition}`, inline: true })
      }

      interaction.followUp({ embeds: [embed], ephemeral: true })
    });
  },
};
