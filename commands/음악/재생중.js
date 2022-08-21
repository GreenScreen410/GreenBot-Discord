const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("재생중")
    .setDescription("현재 재생중인 노래 정보를 알려줍니다."),

  run: async (client, interaction) => {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("재생중인 노래")
      .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`)
      .addFields({ name: "\u200b", value: progress })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const button1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId("musicPause").setEmoji("⏯️").setStyle(2),
        new ButtonBuilder().setCustomId("musicSkip").setEmoji("⏭").setStyle(2),
        new ButtonBuilder().setCustomId("musicRepeat").setEmoji("🔁").setStyle(2),
        new ButtonBuilder().setCustomId("musicShuffle").setEmoji("🔀").setStyle(2),
      )
    const button2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId("musicQueue").setEmoji("📄").setStyle(2),
        new ButtonBuilder().setCustomId("musicQueueClear").setEmoji("💥").setStyle(2),
      )

    interaction.followUp({ embeds: [embed], components: [button1, button2] });

    const collector = interaction.channel.createMessageComponentCollector();
    collector.on("collect", async i => {
      i.deferUpdate();

      if (i.customId === "musicPause") {
        if (queue.setPaused(true)) {
          let musicPause = require("./정지.js");
          return musicPause.run(client, interaction);
        } else {
          let musicResume = require("./재개.js");
          return musicResume.run(client, interaction);
        }
      }

      if (i.customId === "musicQueue") {
        let musicQueueFile = require("./재생목록.js");
        musicQueueFile.run(client, interaction);
      }

      if (i.customId === "musicSkip") {
        let musicSkipFile = require("./넘기기.js");
        musicSkipFile.run(client, interaction);
      }

      if (i.customId === "musicQueueClear") {
        let musicQueueClear = require("./재생목록초기화.js");
        musicQueueClear.run(client, interaction);
      }

      if (i.customId === "musicRepeat") {
        let musicRepeat = require("./반복.js");
        musicRepeat.run(client, interaction);
      }

      if (i.customId === "musicShuffle") {
        let musicShuffle = require("./섞기.js");
        musicShuffle.run(client, interaction);
      }
    });
  },
};
