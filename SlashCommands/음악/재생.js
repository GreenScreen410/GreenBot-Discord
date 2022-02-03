const { QueryType } = require("discord-player");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
    name: "재생",
    description: "노래를 재생합니다.",
    options: [
        { name: "노래", description: "노래 제목을 입력해 주세요.", type: "STRING", required: true },
    ],

    run: async (client, interaction) => {
        try {
            // 인자(Argument)로 받아온 제목을 songTitle이라는 변수에 저장
            const songTitle = interaction.options.getString("노래");

            // 음성 채널 접속 여부 확인
            if (!interaction.member.voice.channel) {
                ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);
                return;
            }

            // songTitle 변수를 이용해 searchResult라는 검색 결과 변수 생성
            const searchResult = await player.search(songTitle, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            // queue라는 이름의 재생목록 변수 생성
            const queue = await player.createQueue(interaction.guild, {
                metadata: interaction.channel
            });

            // 만약 음성 채널에 접속해있지 않는 상황이라면, 음성 채널에 접속
            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }

            interaction.followUp({ content: `${searchResult.tracks[0].url} 재생 중` });

            searchResult.playlist
                ? queue.addTrack(searchResult.tracks)
                : queue.addTrack(searchResult.tracks[0]);

            // 음악을 재생하고 있지 않는 상황이라면, 음악 재생
            if (!queue.playing) {
                await queue.play();
            }
        } catch (error) {
            const embed = new MessageEmbed()
                .setColor("#FF0000")
                .setTitle("❌ 오류!")
                .setDescription(`${error}`)
                .addFields({ name: "에러 코드", value: "UNDEFINED_ERROR" })
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            interaction.followUp({ embeds: [embed] });
        }
    }
}