import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REST, Routes } from 'discord.js';

const commands = [];
const commandFiles = await readdir(join(dirname(fileURLToPath(import.meta.url)), './commands'));
for (const folders of commandFiles) {
  const folder = await readdir(join(dirname(fileURLToPath(import.meta.url)), `./commands/${folders}`));
  for (const file of folder) {
    if (file.includes('_')) continue;
    const command = (await import(`./commands/${folders}/${file}`)).default;
    commands.push(command.data.toJSON());
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.BETA_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
