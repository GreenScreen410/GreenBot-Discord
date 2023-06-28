import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import tesseract from "tesseract.js";

export default {
  data: new SlashCommandBuilder()
    .setName("글자인식")
    .setDescription("[베타] 이미지에서 글자를 인식합니다.")
    .addAttachmentOption(option => option
      .setName("이미지")
      .setDescription("원하시는 이미지를 넣어주세요. 현재는 한국어만 지원합니다.")
      .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const image = interaction.options.getAttachment("이미지", true);
    const data = await tesseract.recognize(`${image.url}`, "kor");
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setThumbnail(`${image.url}`)
      .setTitle("글자 인식 결과")
      .setDescription(`${data.data.text}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  }
};