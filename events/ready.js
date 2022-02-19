const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.tag} is up and ready to go!`);
  client.user.setActivity({ name: "24시간 명령어", type: "LISTENING" });
});
