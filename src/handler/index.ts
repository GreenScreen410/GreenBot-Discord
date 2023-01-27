import { readdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (client: any) => {
  const commandsArray: string[] = [];
  const commandFolders = readdirSync(`${__dirname}/../commands`);
  for (const category of commandFolders) {
    const commandFiles = readdirSync(`${__dirname}/../commands/${category}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = (await import(`../commands/${category}/${file}`)).default;
      client.commands.set(command.data.name, command);
      commandsArray.push(command.data);
    }
  }

  const buttonFolders = readdirSync(`${__dirname}/../buttons`);
  for (const category of buttonFolders) {
    const buttonFiles = readdirSync(`${__dirname}/../buttons/${category}`).filter((file) => file.endsWith(".js"));
    for (const file of buttonFiles) {
      const button = (await import(`../buttons/${category}/${file}`)).default;
      client.buttons.set(button.data.data.custom_id, button);
    }
  }

  const eventFolders = readdirSync(`${__dirname}/../events`);
  for (const category of eventFolders) {
    const eventFiles = readdirSync(`${__dirname}/../events/${category}`).filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
      const event = (await import(`../events/${category}/${file}`)).default;
    }
  }

  client.on("ready", async () => {
    await client.guilds.cache.get("825741743235268639").commands.set(commandsArray);
    await client.application.commands.set(commandsArray);
  });
}
