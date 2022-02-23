const { SlashCommandBuilder } = require("@discordjs/builders");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("넘기기")
    .setDescription("재생중인 노래를 넘깁니다."),

  run: async (client, interaction) => {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }

    queue.skip();

    interaction.followUp({ content: "재생중인 노래를 넘겼습니다!" });
  },
};
