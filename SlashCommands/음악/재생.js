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

        // 노래 제목을 songTitle이라는 변수에 저장
        const songTitle = interaction.options.getString("노래");

        // 음성 채널 접속 여부 확인
        if(!interaction.member.voice.channel) {
            ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);
            return;
        }

        const searchResult = await player.search(songTitle, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        const queue = await player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        if(!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }

        interaction.followUp({ content: `${songTitle} 재생 중` });

        searchResult.playlist
            ? queue.addTrack(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);

        if(!queue.playing) {
            await queue.play();
        }
    }
}