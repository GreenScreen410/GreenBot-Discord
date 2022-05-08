const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ERROR = require("../ERROR.js");
const userDataSchema = require("../../models/userData");

let members = [];

module.exports = {
  ...new SlashCommandBuilder()
    .setName("점수판")
    .setDescription("점수판을 보여줍니다."),

  run: async (client, interaction) => {
    const userData = await userDataSchema.findOne({ userID: interaction.user.id });
    
    /*
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("TOP 5 점수판")
      .setDescription("모든 종목을 더한 점수입니다.")
      .addFields(
        { name: "🥇 1위", value: `<@${members[0].userID}> - ${members[0].scores}`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    */
    interaction.followUp("현재 개발중인 기능입니다.");
  }
}