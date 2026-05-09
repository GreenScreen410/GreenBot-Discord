import {
  type ChatInputCommandInteraction,
  ContainerBuilder,
  type GuildEmoji,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  PermissionFlagsBits,
  parseEmoji,
  SlashCommandBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stealemoji')
    .setNameLocalizations({
      ko: '이모지훔치기'
    })
    .setDescription('Steals the emoji from another server.')
    .setDescriptionLocalizations({
      ko: '다른 서버의 이모지를 훔쳐옵니다.'
    })
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setNameLocalizations({
          ko: '이모지'
        })
        .setDescription('Please enter an emoji. Default emojis cannot be used.')
        .setDescriptionLocalizations({
          ko: '이모지를 입력해주세요. 기본 이모지는 사용할 수 없습니다.'
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('name')
        .setNameLocalizations({
          ko: '이름'
        })
        .setDescription('Enter a custom name for the emoji. If not provided, the original name will be used.')
        .setDescriptionLocalizations({
          ko: '이모지의 이름을 입력해 주세요. 입력하지 않으면 원래 이름이 사용됩니다.'
        })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.deferReply();
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuildExpressions)) return interaction.error.noPermission();

    const input = interaction.options.getString('emoji', true);
    const emoji = parseEmoji(input);
    if (!emoji?.id) return interaction.error.invalidArgument();

    const name = interaction.options.getString('name') ?? emoji.name;
    const extension = emoji.animated ? 'gif' : 'png';
    const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}?quality=lossless`;

    let created: GuildEmoji;
    try {
      created = await interaction.guild.emojis.create({ attachment: url, name });
    } catch {
      return interaction.error.unknownError();
    }

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        (text) => text.setContent(`## ${interaction.i18n('command.stealemoji.title')}`),
        (text) => text.setContent(`${interaction.i18n('command.stealemoji.description')}\n\n${created.toString()} \`:${created.name}:\``)
      )
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(url)));

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
