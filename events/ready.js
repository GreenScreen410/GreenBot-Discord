const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.tag} is up and ready to go!`);
  client.user.setActivity(({ name: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}명의 유저`, type: "WATCHING" }));
});
