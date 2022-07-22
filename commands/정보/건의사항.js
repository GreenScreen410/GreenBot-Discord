const { SlashCommandBuilder, ModalBuilder, SelectMenuBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  modal: true,

  ...new SlashCommandBuilder()
    .setName("건의사항")
    .setDescription("개발자에게 건의사항을 보냅니다."),

  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId("suggestions")
      .setTitle("📝 건의사항");

    /*
    const categoryInput = new SelectMenuBuilder()
      .setCustomId("categoryInput")
      .setPlaceholder("카테고리를 골라주세요.")
      .addOptions([
        { label: "버그/오류", value: "bug", description: "버그를 찾으셨나요?", emoji: "🐛" },
        { label: "아이디어", value: "idea", description: "좋은 아이디어가 있으신가요?", emoji: "💡" },
        { label: "기타", value: "other", description: "다른 것이 있다면 선택해 주세요.", emoji: "❓" }
      ])
    */

    const descriptionInput = new TextInputBuilder()
      .setCustomId("descriptionInput")
      .setLabel("작성된 의견은 개발자 서버로 전송되며, 모두 읽고 있습니다.")
      .setMaxLength(1000)
      .setStyle(TextInputStyle.Paragraph);

    /*
    const firstActionRow = new ActionRowBuilder().addComponents([
      categoryInput,
    ]);
    */
    const secondActionRow = new ActionRowBuilder().addComponents([
      descriptionInput,
    ]);

    modal.addComponents(secondActionRow);

    await interaction.showModal(modal);
  },
};
