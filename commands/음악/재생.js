const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("재생")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) => option.setName("노래").setDescription("노래 제목을 입력해 주세요.").setRequired(true)),

  run: async (client, interaction) => {
    const songTitle = interaction.options.getString("노래");
    if (!interaction.member.voice.channel) {
      return ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);
    }
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction,
    });

    client.on('voiceStateUpdate', (oldState, newState) => {
      if (!queue || !queue.playing) return;
      if (oldState.channelId === null || typeof oldState.channelId == 'undefined') return;
      if (newState.id !== client.user.id) return;

      const disconnectedEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("⚠️ 음성 채널 퇴장 감지")
        .setDescription("재생목록이 초기화되었습니다.")
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      queue.clear(); queue.destroy();
      return interaction.channel.send({ embeds: [disconnectedEmbed] });
    });

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch (error) {
      queue.destroy();
      return ERROR.CAN_NOT_JOIN_VOICE_CHANNEL(client, interaction);
    }

    const track = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });
    if (!track || !track.tracks.length) {
      return ERROR.CAN_NOT_FIND_MUSIC(client, interaction);
    }
    
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`🎶 ${track.playlist ? "playlist" : "재생목록에 추가되었습니다."}`)
      .setURL(`${track.tracks[0].url}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    if (!track.playlist) {
      embed.setThumbnail(track.tracks[0].thumbnail);
      embed.setDescription(`${track.tracks[0].title}`);
    }

    if (!queue.playing) {
      track.playlist ? queue.addTracks(track.playlist) : queue.play(track.tracks[0]);
      return await interaction.followUp({ embeds: [embed] });
    } else if (queue.playing) {
      track.playlist ? queue.addTracks(track.playlist) : queue.addTrack(track.tracks[0]);
      return await interaction.followUp({ embeds: [embed] });
    }
  },
};
