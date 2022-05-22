import { Client, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import player from "../../events/player";
import ERROR from "../ERROR";

export default {
  ...new SlashCommandBuilder()
    .setName("재생중")
    .setDescription("현재 재생중인 노래 정보를 알려줍니다."),

  run: async (client: Client, interaction: any) => {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("재생중인 노래")
      .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`)
      .addFields({ name: "\u200b", value: progress })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const button = new MessageActionRow()
      .addComponents(
        new MessageButton().setCustomId("musicQueue").setEmoji("📄").setLabel("재생목록").setStyle("PRIMARY"),
        new MessageButton().setCustomId("musicQueueClear").setEmoji("💥").setLabel("재생목록 비우기").setStyle("PRIMARY"),
        new MessageButton().setCustomId("musicSkip").setEmoji("⏭").setLabel("넘기기").setStyle("PRIMARY")
      );

    interaction.followUp({ embeds: [embed], components: [button] });

    const collector = interaction.channel.createMessageComponentCollector();
    collector.on("collect", async i => {
      i.deferUpdate();

      if (i.customId === "musicQueue") {
        let musicQueueFile = require("./재생목록.ts").default;
        musicQueueFile.run(client, interaction);
      }

      if (i.customId === "musicSkip") {
        let musicSkipFile = require("./넘기기.ts").default;
        musicSkipFile.run(client, interaction);
      }

      if (i.customId === "musicQueueClear") {
        let musicQueueClear = require("./재생목록초기화.ts").default;
        musicQueueClear.run(client, interaction);
      }
    });
  },
};
