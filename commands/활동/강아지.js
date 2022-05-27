const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("강아지")
    .setDescription("랜덤 강아지 사진을 불러옵니다."),

  run: async (client, interaction) => {
    let theCatAPIData = await axios({
      method: "GET",
      url: "https://api.thedogapi.com/v1/images/search",
      headers: {
        "x-api-key": process.env.THE_DOG_API_KEY,
      },
    });

    theCatAPIData = JSON.parse(JSON.stringify(theCatAPIData.data));

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(`${theCatAPIData[0].url}`)
      .setTitle("🐶")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
