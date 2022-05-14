const client = require("../index");
const ERROR = require("../commands/ERROR");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply({ ephemeral: false }).catch(() => { });

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) {
      ERROR.INVALID_INTERACTION(client, interaction);
      return;
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

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
  
  console.log(`${interaction.commandName} was ran by ${interaction.user.tag}(${interaction.user.id})`);
});
