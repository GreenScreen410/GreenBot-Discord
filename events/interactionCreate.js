const client = require("../index");
const ERROR = require("../SlashCommands/ERROR");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply({ ephemeral: false }).catch(() => {});

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) {
      ERROR.INVAILD_INTERACTION(client, interaction);
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
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    cmd.run(client, interaction, args);
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }

  // Button Handling
  if (interaction.isButton()) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.customId === "musicQueue") {
      let musicQueueFile = require("../SlashCommands/음악/재생목록.js");
      musicQueueFile.musicQueue(client, interaction);
    }

    if (interaction.customId === "musicSkip") {
      let musicSkipFile = require("../SlashCommands/음악/넘기기.js");
      musicSkipFile.musicSkip(client, interaction);
    }
  }
});
