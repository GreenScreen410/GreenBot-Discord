const { createReadStream } = require("node:fs");
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require("discord.js");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("마리오")
    .setDescription("마리오 사망 효과음을 재생합니다."),

  run: async (client, interaction) => {
    if (!interaction.member.voice.channel) {
      return ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(createReadStream("assets/mario-death.ogg"));

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  }
}
