import { Client, CommandInteraction, MessageActionRow, Modal, TextInputComponent, ModalActionRowComponent } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  modal: true,
  ...new SlashCommandBuilder()
    .setName("건의사항")
    .setDescription("테스트"),

  run: async (client: Client, interaction: CommandInteraction) => {
    const modal = new Modal()
      .setCustomId("건의사항")
      .setTitle("📝 건의사항")
    const paragraph = new TextInputComponent()
      .setCustomId("suggestion")
      .setLabel("작성된 의견은 개발자 서버로 전송되며, 모두 읽고 있습니다.")
      .setStyle("PARAGRAPH");
    const firstActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(paragraph);
    modal.addComponents(firstActionRow);
    
    await interaction.showModal(modal);
  },
};