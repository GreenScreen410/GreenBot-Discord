import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setNameLocalizations({
      ko: '강아지'
    })
    .setDescription('Loads a random dog picture.')
    .setDescriptionLocalizations({
      ko: '랜덤 강아지 사진을 불러옵니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const response = await fetch('https://api.thedogapi.com/v1/images/search', {
      headers: { 'x-api-key': process.env.THE_DOG_API_KEY }
    });
    if (!response.ok) return interaction.error.unknownError();

    const [data] = await response.json();
    if (!data) return interaction.error.unknownError();

    const container = new ContainerBuilder()
      .addMediaGalleryComponents((gallery) => gallery.addItems((item) => item.setURL(data.url)))
      .addSeparatorComponents((separator) => separator.setDivider(true))
      .addTextDisplayComponents((text) =>
        text.setContent(
          `${interaction.i18n('command.dog.description')}: [${data.id}](${data.url})\n${interaction.i18n('command.dog.width')}: ${data.width}px · ${interaction.i18n('command.dog.height')}: ${data.height}px`
        )
      );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
