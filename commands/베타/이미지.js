const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("이미지")
    .setDescription("명령어에 이미지를 넣을 수 있는지 테스트하는 명령어입니다.")
    .addAttachmentOption(option => option.setName("이미지").setDescription("원하시는 이미지를 넣어주세요.").setRequired(true)),

  run: async (client, interaction) => {
    const image = interaction.options.getAttachment("이미지");

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage(`${image.url}`)
      .setTitle("첨부하신 이미지, 이거 맞죠?")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  }
}