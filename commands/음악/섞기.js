const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("섞기")
    .setDescription("노래 재생목록을 랜덤하게 섞습니다."),

  run: function (client, interaction) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    queue.shuffle(1);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🔀 셔플 완료!")
      .setDescription("재생목록이 랜덤하게 섞였습니다. 한번 확인해 보세요!")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("musicQueue").setEmoji("📄").setLabel("재생목록").setStyle(1),
    );

    interaction.followUp({ embeds: [embed], components: [button] });
  },
};
