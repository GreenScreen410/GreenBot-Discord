const voiceClient = require("../../events/voiceStateUpdate");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  ...new SlashCommandBuilder().setName("음성접속순위").setDescription("음성 채널 접속 시간 리더보드를 보여줍니다."),

  run: async (client, interaction, args) => {
    const embed = await voiceClient.generateLeaderboard({
      guild: interaction.guild,
      message: interaction,
      top: 10,
    });

    interaction.followUp({ embeds: [embed] });
  },
};
