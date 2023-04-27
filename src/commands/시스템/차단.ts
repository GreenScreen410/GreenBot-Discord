import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: `${process.env.MYSQL_HOST}`,
  user: "root",
  password: `${process.env.MYSQL_PASSWORD}`,
  database: "greenbot-database",
});

export default {
  data: new SlashCommandBuilder()
    .setName("차단")
    .setDescription("[관리자] 유저의 봇 사용 권한을 막습니다.")
    .addUserOption((option) => option
      .setName("유저")
      .setDescription("유저를 선택해 주세요.")
      .setRequired(true))
    .addBooleanOption((option) => option
      .setName("설정")
      .setDescription("옵션을 선택해 주세요.")
      .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.user.id != "332840377763758082") return;

    const user = interaction.options.getUser("유저", true);
    const boolean = interaction.options.getBoolean("설정");

    if (boolean == true) {
      connection.query(`INSERT INTO ban(ID, ban) VALUES (${user.id}, ${boolean})`)

      const embed = new EmbedBuilder()
        .setColor("#000000")
        .setTitle("🔨 BAN!")
        .setDescription(`<@${user.id}>를 차단하였습니다.`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      interaction.followUp({ embeds: [embed] });
    }

    else {
      connection.query(`UPDATE ban SET ban=0 WHERE id=${user.id}`)

      const embed = new EmbedBuilder()
        .setColor("#000000")
        .setTitle("🔨 UNBAN!")
        .setDescription(`<@${user.id}>를 차단 해제하였습니다.`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      interaction.followUp({ embeds: [embed] });
    }
  }
}