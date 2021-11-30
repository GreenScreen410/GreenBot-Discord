const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    name: "유튜브",
    description: "유튜브를 디스코드 내에서 같이 시청합니다.",
    run: async (client, interaction) => {
        var ERROR = require("../ERROR.js");
        const voiceChannel = interaction.member.voice.channel;
        
        if (!voiceChannel) {
            ERROR.INVAILD_ARGUMENTS(client, interaction);
        } else {
            fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    target_application_id: "755600276941176913", // Youtube Together 아이디
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
                description: `https://discord.gg/${body.code}\n위 링크를 클릭해면 Youtube Together를 시작합니다.`,
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