import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SlashCommandBuilder, time } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setNameLocalizations({
      ko: '어반사전'
    })
    .setDescription('Searches for a word in the Urban Dictionary.')
    .setDescriptionLocalizations({
      ko: '인터넷 영어 오픈사전인 어반사전에서 단어를 검색합니다.'
    })
    .addStringOption((option) =>
      option
        .setName('word')
        .setNameLocalizations({
          ko: '단어'
        })
        .setDescription('Please enter a word.')
        .setDescriptionLocalizations({
          ko: '단어를 입력해 주세요.'
        })
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const word = interaction.options.getString('word', true);
    const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
    if (!res.ok) return interaction.error.unknownError();

    const response = await res.json();
    const data = response.list?.[0];
    if (!data) return interaction.error.invalidArgument();

    const definition = data.definition ? (data.definition.length > 1024 ? `${data.definition.slice(0, 1021)}...` : data.definition) : '정의 없음';
    const example = data.example ? (data.example.length > 1024 ? `${data.example.slice(0, 1021)}...` : data.example) : '예문 없음';

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        (textDisplay) => textDisplay.setContent(`## [${data.word}](${data.permalink})`),
        (textDisplay) => textDisplay.setContent(definition)
      )
      .addTextDisplayComponents(
        (textDisplay) => textDisplay.setContent(`## 예문`),
        (textDisplay) => textDisplay.setContent(example)
      )
      .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`-# 작성자: ${data.author} · 작성일: ${time(new Date(data.written_on))}`));
    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
