import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

const tier = [
  "<:unranked:857632511117754429>",
  "<:bronze5:857632515854172160>",
  "<:bronze4:857632511181586443>",
  "<:bronze3:857632511072665650>",
  "<:bronze2:857632511060607036>",
  "<:bronze1:857632510997692446>",

  "<:silver5:857632511243976754>",
  "<:silver4:857632511189450784>",
  "<:silver3:857632511424593950>",
  "<:silver2:857632511337037834>",
  "<:silver1:857632510841192479>",

  "<:gold5:857632511088525321>",
  "<:gold4:857632511111069716>",
  "<:gold3:857632511181717564>",
  "<:gold2:857632511035047986>",
  "<:gold1:857632511080005632>",

  "<:platinum5:857632511228248074>",
  "<:platinum4:857632511270191114>",
  "<:platinum3:857632511151308800>",
  "<:platinum2:857632511110021150>",
  "<:platinum1:857632511625265152>",

  "<:diamond5:857632511374131270>",
  "<:diamond4:857632511155765259>",
  "<:diamond3:857632511228510228>",
  "<:diamond2:857632511038193664>",
  "<:diamond1:857632511327469609>",

  "<:ruby5:857632511214747698>",
  "<:ruby4:857632511151439902>",
  "<:ruby3:857632511182372894>",
  "<:ruby2:857632511185518622>",
  "<:ruby1:857632510937792590>",
]

export default {
  data: new SlashCommandBuilder()
    .setName("백준")
    .setDescription("백준 문제 정보를 불러옵니다.")
    .addIntegerOption((option) => option
      .setName("문제")
      .setDescription("문제 ID를 입력해 주세요.")
      .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const problemID = interaction.options.getInteger("문제");

    let problemData: any = await axios.get(`https://solved.ac/api/v3/problem/show?problemId=${problemID}`);
    problemData = JSON.parse(JSON.stringify(problemData.data));

    const embed = new EmbedBuilder()
      .setURL(`https://www.acmicpc.net/problem/${problemID}`)
      .setColor("Random")
      .setTitle(`${problemData.problemId} - ${problemData.titleKo}`)
      .setDescription(`난이도: ${tier[problemData.level]}`)
      .addFields(
        { name: "<:ac:955478410682069038> 맞은 사람", value: `${problemData.acceptedUserCount}`, inline: true },
        { name: "🔁 평균 시도 횟수", value: `${problemData.averageTries}`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    // 간혹 알고리즘 태그가 없는 문제들이 있기 때문에, 해당 조건문이 필요합니다.
    if (Object.keys(problemData.tags).length) {
      let tags = "";
      for (let i = 0; i < Object.keys(problemData.tags).length; i++) {
        tags += problemData.tags[i].displayNames[0].name + "\n";
      }
      embed.addFields(
        { name: "📛 알고리즘 분류", value: `${tags}`, inline: false }
      )
    }

    return interaction.followUp({ embeds: [embed] });
  },
}
