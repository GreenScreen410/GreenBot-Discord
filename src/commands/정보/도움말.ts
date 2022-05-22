import { Client, MessageEmbed, MessageActionRow, MessageSelectMenu, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  ...new SlashCommandBuilder()
    .setName("도움말")
    .setDescription("사용 가능한 모든 명령어를 확인하세요."),

  run: async (client: Client, interaction: any) => {
    const emojis = {
      정보: "ℹ️",
      서버: "🌐",
      음악: "🎵",
      유저: "👤",
      활동: "🎮",
    };

    const descriptions = {
      정보: "여러 잡다한 정보들을 확인해보세요.",
      서버: "현재 접속해 있는 서버 관련 정보를 얻을 수 있습니다.",
      음악: "음악 재생, 가사 등의 기능을 제공합니다.",
      유저: "유저(사용자) 관련 정보를 얻을 수 있습니다.",
      활동: "채팅으로 즐길 수 있는 게임들이 있습니다.",
    };

    const directories = [...new Set(client.slashCommands.map((cmd) => cmd.directory))];
    const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    const categories = directories.map((dir) => {
      const getCommands = client.slashCommands
        .filter((cmd) => cmd.directory === dir)
        .map((cmd) => {
          return {
            name: cmd.name || "(이름이 없습니다.)",
            description: cmd.description || "(설명이 없습니다.)",
          };
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const mainEmbed = new MessageEmbed()
      .setDescription("아래 메뉴에서 카테고리를 골라주세요.")
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("카테고리를 골라주세요.")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: descriptions[cmd.directory.toLowerCase()] || null,
                // description: `${cmd.directory} 카테고리에 있는 명령어들입니다.` || null,
                emoji: emojis[cmd.directory.toLowerCase()] || null,
              };
            })
          )
      ),
    ];

    const initialMessage = await interaction.channel.send({
      embeds: [mainEmbed],
      components: components(false),
    });

    const filter = (interaction) => interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      // time: 5000,
    });

    collector.on("collect", (interaction, cmd) => {
      const [directory] = interaction.values;
      const category = categories.find((x) => x.directory.toLowerCase() === directory);

      const categoryEmbed = new MessageEmbed()
        .setTitle(`${directory}`)
        .setColor("RANDOM")
        .setDescription("해당 카테고리에 있는 명령어들입니다.")
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initialMessage.description({ components: components(true) });
    });
  },
};