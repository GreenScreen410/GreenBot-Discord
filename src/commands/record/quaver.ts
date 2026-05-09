import { SlashCommandBuilder } from 'discord.js';

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
};
