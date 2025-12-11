import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { QuaverUser } from '../../types/quaver';

interface QuaverSearchResponse {
  users: QuaverUser[];
}

export default {
  data: new SlashCommandBuilder()
    .setName('quaver')
    .setNameLocalizations({
      ko: '퀘이버'
    })
    .setDescription('Quaver game related commands.')
    .setDescriptionLocalizations({
      ko: '퀘이버 게임 관련 명령어입니다.'
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setNameLocalizations({
          ko: '유저'
        })
        .setDescription('Search for a Quaver user by nickname.')
        .setDescriptionLocalizations({
          ko: '닉네임으로 퀘이버 유저 정보를 검색합니다.'
        })
        .addStringOption((option) =>
          option
            .setName('nickname')
            .setNameLocalizations({
              ko: '닉네임'
            })
            .setDescription('The nickname to search for.')
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const nickname = interaction.options.getString('nickname', true);
    const subcommand = interaction.options.getSubcommand();

    const response = await fetch(`https://api.quavergame.com/v2/user/search/${encodeURIComponent(nickname)}`);
    const data = (await response.json()) as QuaverSearchResponse;
    const user: QuaverUser = data.users[0];
    if (data.users.length === 0) return interaction.error.invalidArgument();

    const module = await import(`./quaver_${subcommand}.js`);
    await module.subcommand(interaction, user);
  }
};
