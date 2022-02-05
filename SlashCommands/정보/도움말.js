const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu, CategoryChannel } = require("discord.js");

module.exports = {
    name: "도움말",
    description: "사용 가능한 모든 명령어를 확인하세요.",

    run: async (client, interaction) => {

        const emojis = {
            정보: "ℹ️",
            음악: "🎵",
        }

        const descriptions = {
            정보: "여러 잡다한 정보들을 얻을 수 있습니다.",
            음악: "음악 재생, 가사 등 음악 관련 명령어가 있습니다.",
        }

        const directories = [...new Set(client.slashCommands.map(cmd => cmd.directory))];
        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`
        const categories = directories.map((dir) => {
            const getCommands = client.slashCommands
                .filter((cmd) => cmd.directory === dir)
                .map(cmd => {
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

        const embed = new MessageEmbed()
            .setDescription("아래 메뉴에서 카테고리를 골라주세요.")
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })

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
                            }
                        })
                    )
            )
        ];

        const initialMessage = await interaction.channel.send({
            embeds: [embed],
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
            const category = categories.find(x => x.directory.toLowerCase() === directory);

            const categoryEmbed = new MessageEmbed()
                .setTitle(`${directory}`)
                .setColor("RANDOM")
                .setDescription("해당 카테고리에 있는 명령어들입니다.")
                .addFields(category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true,
                    }
                }))

            interaction.update({ embeds: [categoryEmbed] })
        });

        collector.on("end", () => {
            initialMessage.description({ components: components(true) })
        });
    },
};