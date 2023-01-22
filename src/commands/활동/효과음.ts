import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("효과음")
    .setDescription("여러가지 효과음들을 재생합니다.")
    .addStringOption(option => option
      .setName("효과음")
      .setDescription("효과음을 선택해 주세요.")
      .addChoices({ name: "마리오", value: "mario-death" })
      .addChoices({ name: "사이렌", value: "siren" })
      .addChoices({ name: "코골이", value: "snoring" })
      .setRequired(true)
    )
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    if (!interaction.member.voice.channel) {
      return ERROR.PLEASE_JOIN_VOICE_CHANNEL(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    if (interaction.options.getString("효과음") == "mario-death") {
      const resource = createAudioResource("https://www.myinstants.com/media/sounds/super-mario-death-sound-sound-effect.mp3");
      player.play(resource);
      connection.subscribe(player);
      embed.setTitle("📢 **마리오** 효과음을 재생합니다.")
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("효과음") == "siren") {
      const resource = createAudioResource("https://www.myinstants.com/media/sounds/999-social-credit-siren.mp3");
      player.play(resource);
      connection.subscribe(player);
      embed.setTitle("📢 **사이렌** 효과음을 재생합니다.")
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("효과음") == "snoring") {
      const resource = createAudioResource("https://www.myinstants.com/media/sounds/auughhh_DPgW9J1.mp3");
      player.play(resource);
      connection.subscribe(player);
      embed.setTitle("📢 **코골이** 효과음을 재생합니다.")
      return interaction.followUp({ embeds: [embed] });
    }
  }
};
