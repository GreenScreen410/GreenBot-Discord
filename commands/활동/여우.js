const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("여우")
    .setDescription("랜덤 여우 사진을 불러옵니다."),

  run: async (client, interaction) => {
    let theFoxAPIData = await axios.get("https://randomfox.ca/floof/");
    theFoxAPIData = JSON.parse(JSON.stringify(theFoxAPIData.data))

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(`${theFoxAPIData.image}`)
      .setTitle("🦊")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};