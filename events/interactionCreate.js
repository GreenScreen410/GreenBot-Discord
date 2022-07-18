const client = require("../index");
const ERROR = require("../commands/ERROR");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
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

  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }

  if (!interaction.types === 5) return;
    if (interaction.customId === "suggestions") {
      // const category = interaction.fields.getField("categoryInput");
      const description = interaction.fields.getTextInputValue("descriptionInput");
      interaction.guild.members.cache.get("332840377763758082").send({ content: `userID: ${interaction.user.id}\nserver: ${interaction.guild.name}\nuserName: ${interaction.user.tag}\n${description}` });
      interaction.reply("소중한 의견 감사합니다! 차후 버그나 의견이 반영되면 GitHub에 크레딧이 추가됩니다.\n(이 명령어는 현재 테스트 중입니다.)");
    }

  let date = new Date();
  date = date.getFullYear() + "" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1)) + "" + (date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString());

  console.log(`${date + " " + interaction.commandName} was ran by ${interaction.guild.name} - ${interaction.user.tag}(${interaction.user.id})`);
});
