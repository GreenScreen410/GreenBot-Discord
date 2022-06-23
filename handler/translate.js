const axios = require("axios");

module.exports = {
  papago: async function (source, target, text) {
    let translatedText = await axios({
      method: "POST",
      url: "https://openapi.naver.com/v1/papago/n2mt",
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
      },

      data: {
        source: `${source}`,
        target: `${target}`,
        text: `${text}`
      },
    });

    translatedText = JSON.parse(JSON.stringify(translatedText.data));
    translatedText = translatedText.message.result.translatedText

    return translatedText;
  },

  kakao: async function (source, target, text) {
    let translatedText = await axios({
      method: "POST",
      url: "https://dapi.kakao.com/v2/translation/translate",
      params: {
        src_lang: `${source}`,
        target_lang: `${target}`,
        query: `${text}`
      },
      headers: {
        "Authorization": `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
      }
    });

    translatedText = JSON.parse(JSON.stringify(translatedText.data));
    translatedText = translatedText.translated_text[0];

    return translatedText;
  }
};