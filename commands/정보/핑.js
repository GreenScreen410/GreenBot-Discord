const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "핑",
  aliases: ["ㅍ"],

  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("🏓 퐁!")
      .setDescription(`반응 속도 : ${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL()}`,
      });
    message.channel.send({ embeds: [embed] });
  },
};
