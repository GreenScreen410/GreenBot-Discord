const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  name: "재생중",
  description: "현재 재생중인 노래 정보를 알려줍니다.",

  run: async (client, interaction) => {
    const queue = player.getQueue(interaction.guildId);

    // 재생목록이 없을 때 또는(||) 재생중인 노래가 없을 때
    if (!queue || !queue.playing) {
      // ERROR 파일의 MUSIC_QUEUE_IS_EMPTY 함수 실행
      ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    // progress라는 노래 진행도를 알려주는 변수 생성
    const progress = queue.createProgressBar();

    // perc라는 노래 시간을 알려주는 변수 생성
    const perc = queue.getPlayerTimestamp();

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("재생중인 노래")
      .setDescription(
        `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`
      )
      .addFields({ name: "\u200b", value: progress })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });

    const button = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("musicQueue")
        .setEmoji("📄")
        .setLabel("재생목록")
        .setStyle("PRIMARY"),

      new MessageButton()
        .setCustomId("musicQueueClear")
        .setEmoji("💥")
        .setLabel("재생목록 비우기")
        .setStyle("DANGER"),

      new MessageButton()
        .setCustomId("musicSkip")
        .setEmoji("⏭")
        .setLabel("넘기기")
        .setStyle("PRIMARY")
    );

    interaction.followUp({ embeds: [embed], components: [button] });
  },
};
