import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("필터")
    .setDescription("노래 필터를 추가합니다.")
    .addStringOption(option => option
      .setName("필터")
      .setDescription("필터를 지정해 주세요.")
      .addChoices({ name: "8D", value: "8D" })
      .addChoices({ name: "베이스부스트", value: "bassboost" })
      .addChoices({ name: "베이퍼웨이브", value: "vaporwave" })
      .setRequired(true)
    )
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`${queue.current.title}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    if (interaction.options.getString("필터") == "8D") {
      queue.setFilters({ "8D": true });
      embed.setTitle("✨ 8D 필터가 **활성화** 되었습니다.")
      console.log(player.queues);
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("필터") == "bassboost") {
      queue.setFilters({ "bassboost": true });
      embed.setTitle("✨ 베이스부스트 **활성화** 되었습니다.")
      console.log(player.queues);
      return interaction.followUp({ embeds: [embed] });
    }
  }
};
