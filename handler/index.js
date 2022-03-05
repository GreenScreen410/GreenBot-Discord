require("dotenv").config();
const { glob } = require("glob");
const { promisify } = require("util");
const mongoose = require("mongoose");
const globPromise = promisify(glob);

module.exports = async (client) => {
  // Slash Commands
  const slashCommands = await globPromise(`${process.cwd()}/commands/*/*.js`);
  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (!file?.name) return;

    const properties = { directory, ...file };
    client.slashCommands.set(file.name, properties);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
  });

  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));

  // Error
  const errorEmbed = await globPromise(`${process.cwd()}/commands/ERROR.js`);
  const arrayOfErrorEmbed = [];
  errorEmbed.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.errorEmbed.set(file.name, file);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfErrorEmbed.push(file);
  });

  // Slash Commands Register
  client.on("ready", async () => {
    // Register for a single guild
    await client.guilds.cache.get("825741743235268639").commands.set(arrayOfSlashCommands);

    // Register for all the guilds the bot is in
    // await client.application.commands.set(arrayOfSlashCommands);
  });

  // mongoose
  const mongooseConnectionString = process.env.mongooseConnectionString;
  if (!mongooseConnectionString) return;

  mongoose.connect(mongooseConnectionString).then(() => console.log("Connected to mongodb"));
};
