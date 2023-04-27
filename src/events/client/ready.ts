import { Events, Client, ActivityType } from "discord.js";
import chalk from "chalk";

export default {
  name: Events.ClientReady,
  once: true,

  execute(client: Client) {
    console.log(chalk.green.bold(`[READY] ${client.user?.tag} is up and ready to go!`));
    console.log(chalk.green.bold(`[READY] ${client.guilds.cache.size} servers, ${client.users.cache.size} members`));

    const activities = [
      `${client.guilds.cache.size}개의 서버에서 활동`,
      `${client.users.cache.size}명의 유저들이 이용`,
      "❓ /도움말",
      "🧾 여러가지 명령어 처리",
      "🥚 이스터에그 상태 메시지 발견!",
      "🎧 음악 재생",
      "🏫 학교 정보 검색",
      "⚠️ 오류가 있나 확인",
      "🤔 무슨 기능을 넣을지 생각",
      "🎮 여러 활동",
      "👀 명령어 기록 확인",
    ];

    setInterval(() => {
      const index = Math.floor(Math.random() * activities.length);
      client.user?.setActivity({ name: `${activities[index]}`, type: ActivityType.Playing });
    }, 3000)
  }
}
