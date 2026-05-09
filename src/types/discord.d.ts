import type { AutocompleteInteraction, ChatInputCommandInteraction, Collection, ModalSubmitInteraction, SlashCommandBuilder } from 'discord.js';
import type { LavalinkManager } from 'lavalink-client';
import type { ErrorHandler } from '@/handler/error.js';

interface Command {
  data: SlashCommandBuilder;
  modal?: (interaction: ModalSubmitInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  execute: (interaction: ChatInputCommandInteraction<'cached'>) => Promise<unknown>;
  subcommands?: Record<string, (interaction: ChatInputCommandInteraction<'cached'>) => Promise<unknown>>;
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    lavalink: LavalinkManager;
  }

  interface BaseInteraction {
    i18n: import('i18next').TFunction;
    userLocale: string;
    error: ErrorHandler;
  }
}
