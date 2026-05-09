import {
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  SeparatorSpacingSize,
  SlashCommandBuilder
} from 'discord.js';
import { sql } from 'drizzle-orm';
import countries from 'i18n-iso-countries';
import { db } from '@/db/index.js';
import { activities } from '@/db/schema/users.js';

export default {
  data: new SlashCommandBuilder()
    .setName('flagquiz')
    .setNameLocalizations({ ko: '국기퀴즈' })
    .setDescription('Guess the flag of random countries! Some non-country flags are included.')
    .setDescriptionLocalizations({
      ko: '랜덤한 국기를 맞춰보세요! 국가가 아닌 것도 일부 포함되어 있습니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    const [answer, ...wrongs] = Object.keys(countries.getAlpha2Codes())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const countryNames = new Intl.DisplayNames([interaction.locale], { type: 'region' });
    const answerName = countryNames.of(answer) || answer;
    const buttons = [
      new ButtonBuilder().setCustomId('correct').setLabel(answerName).setStyle(ButtonStyle.Primary),
      ...wrongs.map((code, i) =>
        new ButtonBuilder()
          .setCustomId(`wrong${i}`)
          .setLabel(countryNames.of(code) || code)
          .setStyle(ButtonStyle.Primary)
      )
    ].sort(() => Math.random() - 0.5);

    const flagUrl = `https://flagcdn.com/w320/${answer.toLowerCase()}.png`;
    const quizContainer = new ContainerBuilder().addMediaGalleryComponents((gallery) => gallery.addItems((item) => item.setURL(flagUrl)));

    const container = new ContainerBuilder()
      .addMediaGalleryComponents((gallery) => gallery.addItems((item) => item.setURL(flagUrl)))
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addActionRowComponents((row) => row.addComponents(...buttons));
    const reply = await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });

    const collector = reply.createMessageComponentCollector<ComponentType.Button>({
      componentType: ComponentType.Button,
      time: 10000
    });

    let answered = false;
    collector.on('collect', async (i) => {
      if (answered) return;
      answered = true;
      collector.stop();
      await i.deferUpdate();
      const isCorrect = i.customId === 'correct';

      const [result] = isCorrect
        ? await db
            .insert(activities)
            .values({ id: i.user.id, flagquiz: 1n })
            .onConflictDoUpdate({
              target: activities.id,
              set: { flagquiz: sql`${activities.flagquiz} + 1` }
            })
            .returning({ flagquiz: activities.flagquiz })
        : await db.select({ flagquiz: activities.flagquiz }).from(activities).where(sql`${activities.id} = ${i.user.id}`);

      const resultContainer = new ContainerBuilder().setAccentColor(isCorrect ? 0x00ff00 : 0xff0000).addTextDisplayComponents(
        (text) =>
          text.setContent(
            `## ${isCorrect ? '✅' : '❌'} ${interaction.i18n(`command.guesstheflag.${isCorrect ? 'correct' : 'wrong'}`, { user: `<@${i.user.id}>` })}`
          ),
        (text) =>
          text.setContent(
            interaction.i18n('command.guesstheflag.description', {
              country: answerName,
              score: Number(result?.flagquiz ?? 0n)
            })
          )
      );

      await interaction.editReply({ components: [quizContainer, resultContainer] });
    });

    collector.on('end', async () => {
      if (!answered) {
        const timeoutContainer = new ContainerBuilder().setAccentColor(0xffff00).addTextDisplayComponents(
          (text) => text.setContent(`## ⏰ ${interaction.i18n('command.guesstheflag.timeout')}`),
          (text) => text.setContent(interaction.i18n('command.guesstheflag.timeout_description', { country: answerName }))
        );
        await interaction.editReply({ components: [quizContainer, timeoutContainer] });
      }
    });
  }
};
