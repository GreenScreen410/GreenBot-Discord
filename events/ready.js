const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.tag} is up and ready to go!`);
  
  const activities = [
    `${client.guilds.cache.size}개의 서버에서 활동`,
    `${client.users.cache.size}명의 유저들이 이용`,
    "❓ /도움말",
    "🧾 여러가지 명령어 처리",
    "🥚 이스터에그 상태 메시지 발견!",
    "🎧 음악 재생",
    "🏫 학교 정보 검색",
    "⚠️ 오류가 있나 확인",
  ];

  setInterval(() => {
    const index = Math.floor(Math.random() * activities.length);
    client.user.setActivity(activities[index]);
  }, 3000)
});
