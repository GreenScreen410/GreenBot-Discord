import { ContainerBuilder, Events, type Guild, MessageFlags, SeparatorSpacingSize } from 'discord.js';
import { logger } from '@/handler/logger.js';

export default {
  name: Events.GuildCreate,

  async execute(guild: Guild) {
    logger.info(`Invited to ${guild.name}(${guild.id}), ${guild.memberCount} members`);

    const [guildSizes, memberSizes] = await Promise.all([
      guild.client.shard?.fetchClientValues('guilds.cache.size') as Promise<number[]>,
      guild.client.shard?.broadcastEval((c) => c.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)) as Promise<number[]>
    ]);
    const totalGuilds = guildSizes.reduce((a, b) => a + b, 0).toLocaleString();
    const totalMembers = memberSizes.reduce((a, b) => a + b, 0).toLocaleString();

    const container = new ContainerBuilder()
      .setAccentColor(0x73c55c)
      .addTextDisplayComponents(
        (text) => text.setContent('## 🙇‍♂️ 초대해 주셔서 감사합니다!'),
        (text) => text.setContent(`그린Bot은 **${totalGuilds}개의 서버, ${totalMembers}명의 유저**와 함께 하고 있습니다!`)
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small))
      .addTextDisplayComponents((text) =>
        text.setContent('💌 [한국 디스코드 리스트](https://bit.ly/3TveLdR)\n🆘 [디스코드 지원 서버](https://discord.gg/7znkdKNxm8)\n🐱 [깃허브](https://bit.ly/3z8JMfg)')
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents((text) =>
        text.setContent('-# /언어 명령어로 언어를 변경할 수 있습니다.\n-# You can change the language with the /language command.')
      );

    await guild.systemChannel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
