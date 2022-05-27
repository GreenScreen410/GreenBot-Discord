const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("어반사전")
    .setDescription("어반사전을 확인합니다.")
    .addStringOption((option) => option.setName("단어").setDescription("원하시는 단어를 입력해 주세요.").setRequired(true)),

  run: async (client, interaction) => {
    const word = interaction.options.getString("단어");
    let urbanDictionaryData = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
    urbanDictionaryData = JSON.parse(JSON.stringify(urbanDictionaryData.data));

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${urbanDictionaryData.list[0].word}`)
      .setURL(`${urbanDictionaryData.list[0].permalink}`)
      .setDescription(`${urbanDictionaryData.list[0].definition}`)
      .addFields(
        { name: "예문", value: `${urbanDictionaryData.list[0].example}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
  },
}