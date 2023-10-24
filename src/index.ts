import "dotenv/config.js";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Player } from "discord-player";
import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url"
const __dirname = dirname(fileURLToPath(import.meta.url));

declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
    error: typeof import("./handler/error.js").default;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
});
client.commands = new Collection();
client.buttons = new Collection();
client.error = (await import("./handler/error.js")).default;
const player = Player.singleton(client, {
  ytdlOptions: {
    quality: "highestaudio",
    filter: "audioonly",
  },
});
await player.extractors.loadDefault();

const commands: any = [];
const commandFiles = await readdir(join(__dirname, "./commands"));
for (const folders of commandFiles) {
  const folder = await readdir(join(__dirname, `./commands/${folders}`));
  for (const file of folder) {
    const command = (await import(`./commands/${folders}/${file}`)).default;
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
}

const eventFiles = await readdir(join(__dirname, "./events"));
for (const folders of eventFiles) {
  const folder = await readdir(join(__dirname, `./events/${folders}`));
  for (const file of folder) {
    const event = (await import(`./events/${folders}/${file}`)).default;
    if (folders == "client" || folders == "interaction") {
      client.on(event.name, (...args) => event.execute(...args));
    }
    else if (folders == "player") {
      player.events.on(event.name, (...args: any) => event.execute(...args));
    }
  }
}

client.on("ready", async () => {
  await client.guilds.cache.get("825741743235268639")?.commands.set(commands);
  await client.application?.commands.set(commands);
});
client.login(process.env.BETA_TOKEN);
