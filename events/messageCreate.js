require("dotenv").config();
const client = require("../index");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.content.startsWith(process.env.prefix)) return;

  const [cmd, ...args] = message.content.slice(process.env.prefix.length).trim().split(/ +/g);

  const command = client.commands.get(cmd.toLowerCase()) || client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;
  await command.run(client, message, args);

  console.log(`${command.name} was ran by ${message.author.tag}(${message.author.id})`);
});
