const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
const os = require("os");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("유저정보")
    .setDescription("해당 유저의 정보를 보여줍니다.")
    .addUserOption((option) => option.setName("유저").setDescription("유저를 선택해주세요.").setRequired(true)),

  run: async (client, interaction) => {
    const user = interaction.options.getUser("유저");
    if (!user) {
      return ERROR.PLEASE_TYPE_ARGUMENTS(client, interaction);
    }

    if (user.id == "767371161083314236") {
      const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${user.tag}의 정보`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "이름", value: `${user.username}`, inline: true },
        { name: "ID", value: `${user.id}`, inline: true },
        { name: "계정 생성일", value: `${moment(user.createdAt).locale("ko").format("YYYY년 MMMM Do h:mm:ss")}`, inline: true },
        { name: "서버 참여일", value: `(수정 중)`, inline: true },
        { name: "OS", value: `${os.type()} ${os.version()} ${os.release()}`, inline: true },
        { name: "메모리 상태", value: `${Math.round(os.freemem()/1000000)} MB/${Math.round(os.totalmem()/1000000)} MB`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });

    } else {
      const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${user.tag}의 정보`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "이름", value: `${user.username}`, inline: true },
        { name: "ID", value: `${user.id}`, inline: true },
        { name: "계정 생성일", value: `${moment(user.createdAt).locale("ko").format("YYYY년 MMMM Do h:mm:ss")}`, inline: true },
        { name: "서버 참여일", value: `${moment(interaction.guild.joinedAt).locale("ko").format("YYYY년 MMMM Do h:mm:ss")}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
    }
  },
};
