import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import achievements from '../achievements.json' assert { type: 'json' }

const position: Record<string, [number, string]> = {}
for (let i = 0; i < Object.keys(achievements).length; i++) {
  position[achievements[i].id] = [i, achievements[i].name]
}

export default {
  get: async function (interaction: ChatInputCommandInteraction, name: string) {
    const [result]: any = await interaction.client.mysql.query(`UPDATE achievements SET ${name}=1 WHERE id=${interaction.user.id}`)
    if (result.info.includes('Changed: 0') === true) return

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('⭐ 도전과제 획득!')
      .setDescription(`'${position[name][1]}' 도전과제를 획득하셨어요!\n\n획득 조건: ${achievements[position[name][0]].condition}\n${achievements[position[name][0]].description}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    await interaction.followUp({ embeds: [embed] })
  }
}
