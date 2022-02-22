const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder().setName("서버정보").setDescription("현재 서버의 정보를 보여줍니다."),

  run: async (client, interaction) => {
    if (interaction.channel.type === "DM") {
      return ERROR.CAN_NOT_USE_IN_DM(client, interaction);
    }

    const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map((role) => role.toString());

    const channels = interaction.guild.channels.cache.map((channel) => channel.toString());

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setTitle(`'${interaction.guild.name}' 정보`)
      .addFields(
        { name: "이름", value: `${interaction.guild.name}`, inline: true },
        { name: "ID", value: `${interaction.guild.id}`, inline: true },
        { name: "주인", value: `<@${interaction.guild.ownerId}>`, inline: true },
        { name: "서버 생성일", value: `${moment(interaction.guild.createdAt).locale("ko").format("YYYY년 MMMM Do h:mm:ss")}`, inline: true },
        { name: "유저 수", value: `${interaction.guild.memberCount}명`, inline: true },
        { name: "역할 개수", value: `${roles.length}개`, inline: true },
        { name: "채널 개수(카테고리 포함)", value: `${channels.length}개`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
  },
};
