import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, parseEmoji } from "discord.js";
import { PermissionsBitField  } from "discord.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("이모지훔치기")
    .setDescription("[니트로] 다른 서버의 이모지를 추가합니다. 기본 이모지는 추가할 수 없습니다.")
    .addStringOption((option) => option
      .setName("이모지")
      .setDescription("이모지를 입력해 주세요.")
      .setRequired(true))
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    const rawEmoji = interaction.options.getString("이모지", true);

    try {
      const emoji = parseEmoji(rawEmoji)
      if (!emoji) return ERROR.INVALID_ARGUMENT(interaction);
      
      const extension = emoji.animated ? ".gif" : ".png";
      const url = `https://cdn.discordapp.com/emojis/${emoji.id + extension}`;

      interaction.guild.emojis.create({ attachment: url, name: emoji.name });

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("😛 이모지가 추가되었습니다.")
        .addFields(
          { name: "😀 이모지", value: `${rawEmoji}`, inline: true },
          { name: "📛 원본 이름", value: `${emoji.name}`, inline: true },
          { name: "🆔 원본 ID", value: `${emoji.id}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      interaction.followUp({ embeds: [embed] });
    }

    catch (error) {
      return ERROR.INVALID_ARGUMENT(interaction);
    }
  },
};