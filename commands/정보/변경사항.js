const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const cheerio = require("cheerio");
const ERROR = require("../ERROR");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("변경사항")
    .setDescription("그린Bot의 최근 변경사항을 불러옵니다."),

  run: async (client, interaction) => {
    let githubReleasesData = await axios.get("https://github.com/GreenScreen410/GreenBot-Discord/releases");
    let githubCommitData = await axios.get("https://github.com/GreenScreen410/GreenBot-Discord/commit/main");
    githubReleasesData = JSON.parse(JSON.stringify(githubReleasesData.data));
    githubCommitData = JSON.parse(JSON.stringify(githubCommitData.data));

    githubReleasesData = cheerio.load(githubReleasesData);
    const latestRelease = githubReleasesData("div:nth-child(2) > div:nth-child(1) > div.col-md-9 > div > div.Box-body > div.markdown-body.my-3").text().trim();
    
    githubCommitData = cheerio.load(githubCommitData);
    const latestCommit = githubCommitData("#repo-content-pjax-container > div > div.commit.full-commit.mt-0.px-2.pt-2 > div.commit-title.markdown-title").text().trim();

    try {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`최근 변경사항: ${latestCommit}`)
        .setDescription(`${latestRelease}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      interaction.followUp({ embeds: [embed] });

    } catch (error) {
      ERROR.UNKNOWN_ERROR(client, interaction);
    }
  },
}
