const fetch = require("node-fetch");

module.exports = {
    name: "포커",
    description: "포커를 디스코드 내에서 플레이합니다.",
    run: async (client, interaction) => {
        
        const voiceChannel = interaction.member.voice.channel;
        
        if (!voiceChannel) {
            const ErrorEmbed = {
                color: 0xFF0000,
                title: "❌ 오류!",
                description: "먼저 음성 채널에 연결해 주세요.",
                fields: [
                    {
                        name: "에러 코드",
                        value: "PLEASE_CONNECT_VOICE_CHANNEL"
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `Requested by ${interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL()
                }
            }
            return interaction.channel.send({ embeds: [ErrorEmbed] });

            } else {
                fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
        
                target_application_id: "755827207812677713", // Poker Night 아이디
                target_type: 2,
                temporary: false,
         
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
            
        }).then(res => res.json())
        .then(body => {
            const embed = {
                color: 0xFF0000,
                title: "▶️ 준비 완료!",
                description: `https://discord.gg/${body.code}\n위 링크를 클릭하면 Poker Night를 시작합니다.`,
                timestamp: new Date(),
                footer: {
                    text: `Requested by ${interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL()
                }
            }

            return interaction.channel.send({ embeds: [embed] });
            })
        }
    }
}