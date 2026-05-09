import { readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import '@/handler/i18n.js';
import { logger } from '@/handler/logger.js';

const botDir = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages]
});
client.commands = new Collection();
client.lavalink = (await import('./handler/lavalink.js')).default(client);
logger.info('Loading commands...');
const commands: unknown[] = [];
const categories = await readdir(join(botDir, 'commands'));
for (const category of categories) {
  const entries = await readdir(join(botDir, 'commands', category));
  for (const entry of entries) {
    const entryPath = join(botDir, 'commands', category, entry);
    const entryStat = await stat(entryPath);

    if (entryStat.isDirectory()) {
      // Subcommand folder: load parent command file and register subcommands
      const command = (await import(`./commands/${category}/${entry}.ts`)).default;
      const subFiles = await readdir(entryPath);
      for (const subFile of subFiles) {
        const { data, execute } = await import(`./commands/${category}/${entry}/${subFile}`);
        command.data.addSubcommand(data);
        if (!command.subcommands) command.subcommands = {};
        const subName = subFile.replace(/\.(ts|js)$/, '');
        command.subcommands[subName] = execute;
      }
      client.commands.set(command.data.name as string, command);
      commands.push(command.data.toJSON());
      continue;
    }

    if (!entry.endsWith('.ts') && !entry.endsWith('.js')) continue;
    // Skip subcommand files (underscore convention) and parent command files with matching folder
    if (entry.includes('_')) continue;
    const name = entry.replace(/\.(ts|js)$/, '');
    if (entries.includes(name)) continue;

    const command = (await import(`./commands/${category}/${entry}`)).default;
    client.commands.set(command.data.name as string, command);
    commands.push(command.data.toJSON());
  }
}

logger.info(`Loaded ${client.commands.size} commands`);

const eventFiles = await readdir(join(botDir, 'events'));
for (const folders of eventFiles) {
  const folder = await readdir(join(botDir, 'events', folders));
  for (const file of folder) {
    const event = (await import(`./events/${folders}/${file}`)).default;
    if (folders === 'client' || folders === 'interaction' || folders === 'message') {
      if (event.name === Events.Raw) {
        client.on(event.name, (d: unknown) => event.execute(client, d));
        continue;
      }

      if (event.once === true) {
        client.once(event.name, (...args: unknown[]) => event.execute(...args));
      } else {
        client.on(event.name, (...args: unknown[]) => event.execute(...args));
      }
    } else if (folders === 'lavalink') {
      client.lavalink.on(event.name, (...args: unknown[]) => event.execute(...args));
    }
  }
}

logger.info('Loaded events');

await client.login(process.env.TOKEN);

// Register slash commands
const rest = new REST().setToken(process.env.TOKEN);
if (process.env.NODE_ENV === 'production') {
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  logger.info(`Registered ${commands.length} global commands`);
} else {
  await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
  logger.info(`Registered ${commands.length} guild commands`);
}
