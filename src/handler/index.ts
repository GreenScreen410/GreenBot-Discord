import "dotenv/config";
import { Client, ApplicationCommandDataResolvable } from "discord.js";
import glob from "glob";
import { promisify } from "util";
import mongoose from "mongoose";
const globPromise = promisify(glob);

module.exports =  async (client: Client) => {
  const slashCommands = await globPromise(`${process.cwd()}/src/commands/*/*.ts`);
  const arrayOfSlashCommands: ApplicationCommandDataResolvable[] = [];
  slashCommands.map((value) => {
    const file = require(value).default;
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    const properties = { directory, ...file };
    client.slashCommands.set(file.name, properties);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
  });

  const errorEmbed = await globPromise(`${process.cwd()}/src/commands/ERROR`);
  const arrayOfErrorEmbed = [];
  errorEmbed.map((value) => {
    const file = require(value).default;
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    const properties = { directory, ...file };
    client.errorEmbeds.set(file.name, properties);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfErrorEmbed.push(file);
  });

  const eventFiles = await globPromise(`${process.cwd()}/src/events/*.ts`);
  eventFiles.map((value) => require(value));

  client.on("ready", async () => {
    await client.guilds.cache.get("825741743235268639").commands.set(arrayOfSlashCommands);
    // await client.application.commands.set(arrayOfSlashCommands);
  });

  // mongoose
  const mongooseConnectionString = process.env.mongooseConnectionString;
  if (!mongooseConnectionString) return;

  mongoose.connect(mongooseConnectionString).then(() => console.log("Connected to mongodb"));
};
