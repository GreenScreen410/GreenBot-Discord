import { Client, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createReadStream } from "fs";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("마리오")
    .setDescription("마리오 사망 효과음을 재생합니다.")
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">) => {
    if (!interaction.inCachedGuild()) return;

    if (!interaction.member.voice.channel) {
      return ERROR.PLEASE_JOIN_VOICE_CHANNEL(interaction);
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(createReadStream("src/assets/mario-death.ogg"));

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
