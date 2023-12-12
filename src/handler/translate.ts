import axios from 'axios'

export default {
  papago: async function (source: string, target: string, text: string) {
    let translatedText: any = await axios({
      method: 'POST',
      url: 'https://openapi.naver.com/v1/papago/n2mt',
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      },

      data: {
        source: `${source}`,
        target: `${target}`,
        text: `${text}`
      }
    })

    translatedText = JSON.parse(JSON.stringify(translatedText.data))
    translatedText = translatedText.message.result.translatedText

    return translatedText
  }
}
