import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";

export default {
  data: new SlashCommandBuilder()
    .setName("변경사항")
    .setDescription("그린Bot의 최근 변경사항을 불러옵니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    let githubReleasesData: any = await axios.get("https://github.com/GreenScreen410/GreenBot-Discord/releases");
    githubReleasesData = cheerio.load(githubReleasesData.data);
    const latestRelease = githubReleasesData("#repo-content-pjax-container > div > div:nth-child(3) > section:nth-child(1) > div > div.col-md-9 > div > div.Box-body > div.markdown-body.my-3").text().trim();;

    let githubCommitData: any = await axios.get("https://github.com/GreenScreen410/GreenBot-Discord/commit/main");
    githubCommitData = cheerio.load(githubCommitData.data);
    const latestCommit = githubCommitData("#repo-content-pjax-container > div > div.commit.full-commit.mt-0.px-2.pt-2 > div.commit-title.markdown-title").text().trim();;

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("GitHub로 이동하기")
      .setURL("https://github.com/GreenScreen410/GreenBot-Discord")
      .addFields(
        { name: "최근 커밋", value: latestCommit, inline: false },
        { name: "최근 릴리즈", value: latestRelease, inline: false }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
  },
}
