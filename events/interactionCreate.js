const client = require("../index");
const ERROR = require("../commands/ERROR");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) {
      ERROR.INVALID_INTERACTION(client, interaction);
      return;
    }

    if (!cmd.modal) {
      await interaction.deferReply({ ephemeral: false }).catch(() => { });
    }

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction, args);
  }

  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }

  let date = new Date();
  date = date.getFullYear() + "" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1)) + "" + (date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString());

  console.log(`${date + " " + interaction.commandName} was ran by ${interaction.guild.name} - ${interaction.user.tag}(${interaction.user.id})`);
});
