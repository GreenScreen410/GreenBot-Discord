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

  if (!interaction.isModalSubmit()) return;
  await interaction.deferReply({ ephemeral: true });
  const paragraph = interaction.fields.getTextInputValue('suggestion');
  interaction.editReply({ content: "소중한 의견 감사합니다! 차후 버그나 의견이 반영되면 GitHub에 크레딧이 추가됩니다." })
  console.log({ userID: interaction.user.id, userName: interaction.user.tag, paragraph });

  console.log(`${interaction.commandName} was ran by ${interaction.user.tag}(${interaction.user.id})`);
});
