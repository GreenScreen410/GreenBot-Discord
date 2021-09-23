const client = require("../index");

client.on("ready", () =>
    client.user.setActivity("24시간 명령어", { type: 'LISTENING' }),
    console.log(`${client.user.tag} is up and ready to go!`)
);
