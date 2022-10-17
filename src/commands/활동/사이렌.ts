import { Client, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createReadStream } from "fs";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("사이렌")
    .setDescription("매우 큰 사이렌을 재생합니다. 소리에 주의하세요.")
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">) => {
    if (!interaction.member.voice.channel) {
      return ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(createReadStream("src/assets/siren.ogg"));

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
