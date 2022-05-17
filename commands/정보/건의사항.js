const { MessageEmbed, MessageActionRow, Modal, TextInputComponent } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  modal: true,
  ...new SlashCommandBuilder()
    .setName("건의사항")
    .setDescription("테스트"),

  run: async (client, interaction) => {
    const modal = new Modal()
      .setCustomId("건의사항")
      .setTitle("📝 건의사항")
    const paragraph = new TextInputComponent()
      .setCustomId("suggestion")
      .setLabel("작성된 의견은 개발자 서버로 전송되며, 모두 읽고 있습니다.")
      .setStyle("PARAGRAPH");
    const firstActionRow = new MessageActionRow().addComponents(paragraph);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
  },
};