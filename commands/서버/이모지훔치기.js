const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("이모지훔치기")
    .setDescription("[니트로 필요] 이모지를 훔쳐옵니다. 네?")
    .addStringOption((option) => option.setName("이모지").setDescription("[니트로 필요] 이모지를 입력해 주세요.").setRequired(true)),

  run: async (client, interaction) => {
    return ERROR.THIS_COMMAND_IS_FIXING(client, interaction);
  },
};
