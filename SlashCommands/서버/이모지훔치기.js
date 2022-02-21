const { Util, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("이모지훔치기")
    .setDescription("[니트로 필요] 이모지를 훔쳐옵니다. 네?")
    .addStringOption((option) =>
      option
        .setName("이모지")
        .setDescription("[니트로 필요] 이모지를 입력해 주세요.")
        .setRequired(true)
    ),

  run: async (client, interaction, args) => {
    const rawEmoji = interaction.options.getString("이모지");
  
      const parsedEmoji = Util.parseEmoji(rawEmoji);

      if (parsedEmoji.id) {
        const extension = parsedEmoji.animated ? ".gif" : ".png";
        const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;

        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`<:${parsedEmoji.name}:${parsedEmoji.id}>`)
          .setDescription(`해당 이모지가 서버에 성공적으로 추가되었습니다.`)
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}\nThanks for Debugging : TastyRamen#0117 and 한별#8165`, iconURL: `${interaction.user.displayAvatarURL()}` });

        interaction.guild.emojis.create(url, parsedEmoji.name)
          .then((emoji) => interaction.followUp({ embeds: [embed] }))
      }
    
  },
};
