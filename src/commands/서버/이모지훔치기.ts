import { Client, CommandInteraction, Util, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import ERROR from "../ERROR";

export default {
  ...new SlashCommandBuilder()
    .setName("이모지훔치기")
    .setDescription("[니트로 필요] 이모지를 훔쳐옵니다.")
    .addStringOption((option) => option.setName("이모지").setDescription("[니트로 필요] 이모지를 입력해 주세요.").setRequired(true)),

  run: async (client: Client, interaction: CommandInteraction) => {
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
        .setFooter({ text: `Requested by ${interaction.user.tag}\nThanks for Debugging TastyRamen#0117 and 한별#8165`, iconURL: `${interaction.user.displayAvatarURL()}` });
        
      interaction.guild.emojis.create(url, parsedEmoji.name).then((emoji) => interaction.followUp({ embeds: [embed] }));
  
    } else {
      return ERROR.INVALID_ARGUMENT(client, interaction);
    }
  },
};
