import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setNameLocalizations({
      ko: '고양이'
    })
    .setDescription('Loads a random cat picture.')
    .setDescriptionLocalizations({
      ko: '랜덤 고양이 사진을 불러옵니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const response = await fetch('https://api.thecatapi.com/v1/images/search', {
      headers: { 'x-api-key': process.env.THE_CAT_API_KEY }
    });
    if (!response.ok) return interaction.error.unknownError();

    const [data] = await response.json();
    if (!data) return interaction.error.unknownError();

    const container = new ContainerBuilder()
      .addMediaGalleryComponents((gallery) => gallery.addItems((item) => item.setURL(data.url)))
      .addSeparatorComponents((separator) => separator.setDivider(true))
      .addTextDisplayComponents((text) =>
        text.setContent(
          `${interaction.i18n('command.cat.description')}: [${data.id}](${data.url})\n${interaction.i18n('command.cat.width')}: ${data.width}px · ${interaction.i18n('command.cat.height')}: ${data.height}px`
        )
      );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
