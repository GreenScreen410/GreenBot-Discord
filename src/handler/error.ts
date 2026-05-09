import { type BaseInteraction, ContainerBuilder, MessageFlags } from 'discord.js';

type ErrorKey =
  | 'noPermission'
  | 'youHaveBeenBanned'
  | 'unknownError'
  | 'invalidInteraction'
  | 'invalidArgument'
  | 'pleaseJoinVoiceChannel'
  | 'pleaseJoinSameVoiceChannel'
  | 'musicQueueIsEmpty'
  | 'musicIsTooLong'
  | 'musicServerRestarted'
  | 'canNotUseInDm'
  | 'allowanceOnceADay'
  | 'canNotAfford';

export type ErrorHandler = Record<ErrorKey, (params?: Record<string, unknown>) => Promise<unknown>>;

type RepliableInteraction = BaseInteraction & {
  deferred: boolean;
  replied: boolean;
  editReply: (options: object) => Promise<unknown>;
  reply: (options: object) => Promise<unknown>;
};

export function createErrorHandler(interaction: RepliableInteraction): ErrorHandler {
  return new Proxy({} as ErrorHandler, {
    get(_, key: string) {
      return (params?: Record<string, unknown>) => {
        const container = new ContainerBuilder()
          .setAccentColor(0xff0000)
          .addTextDisplayComponents((text) => text.setContent(`## ${interaction.i18n('error.title')}\n${interaction.i18n(`error.${key}`, params)}`))
          .addSeparatorComponents((separator) => separator.setDivider(true))
          .addTextDisplayComponents((text) => text.setContent(`${interaction.i18n('error.code')}: \`${key}\``));

        const payload = { components: [container], flags: MessageFlags.IsComponentsV2 };

        if (interaction.deferred || interaction.replied) {
          return interaction.editReply(payload);
        }
        return interaction.reply(payload);
      };
    }
  });
}
