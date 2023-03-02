import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("필터")
    .setDescription("노래 필터를 추가합니다.")
    .addStringOption(option => option
      .setName("필터")
      .setDescription("필터를 선택해 주세요.")
      .addChoices({ name: "끄기", value: "normalizer2" })
      .addChoices({ name: "8D", value: "8D" })
      .addChoices({ name: "베이스부스트 (소리 주의)", value: "bassboost" })
      .addChoices({ name: "베이퍼웨이브", value: "vaporwave" })
      .addChoices({ name: "나이트코어", value: "nightcore" })
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
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    if (interaction.options.getString("필터") == "normalizer2") {
      queue.setFilters({ "normalizer2": true });
      embed.setTitle("✨ 필터가 **비활성화** 되었습니다.")
      embed.setDescription(`${queue.current.title}\n\n`)
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("필터") == "8D") {
      queue.setFilters({ "8D": true });
      embed.setTitle("✨ 8D 필터가 **활성화** 되었습니다.")
      embed.setDescription(`${queue.current.title}\n\n이거... 상당히 어질어질 한데요?`)
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("필터") == "bassboost") {
      queue.setFilters({ "bassboost": true });
      embed.setTitle("✨ 베이스부스트 필터가 **활성화** 되었습니다.")
      embed.setDescription(`${queue.current.title}\n\n매우 강력한 베이스, 소리의 주의하세요!`)
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("필터") == "vaporwave") {
      queue.setFilters({ "vaporwave": true });
      embed.setTitle("✨ 베이퍼웨이브 필터가 **활성화** 되었습니다.")
      embed.setDescription(`${queue.current.title}\n\n때로는 낮고, 느린 분위기도 좋죠.`)
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("필터") == "nightcore") {
      queue.setFilters({ "nightcore": true });
      embed.setTitle("✨ 나이트코어 필터가 **활성화** 되었습니다.")
      embed.setDescription(`${queue.current.title}\n\n때로는 높고, 빠른 분위기도 좋죠.`)
      return interaction.followUp({ embeds: [embed] });
    }
  }
};
