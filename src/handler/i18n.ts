import { Locale } from 'discord.js'
import i18n from 'i18n'

i18n.configure({
  locales: ['en_US', 'ko'],
  defaultLocale: 'en_US',
  directory: `${process.cwd()}/locales`,
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,
  logWarnFn: console.warn,
  logErrorFn: console.error,
  missingKeyFn: (_locale, value) => {
    return value
  },
  mustacheConfig: {
    tags: ['{', '}'],
    disable: false
  }
})

export function translate (locale: string, key: string, params: any = {}): string {
  i18n.setLocale(locale)
  return i18n.__mf(key, params)
}

export function localizeKey (key: string, params: any = {}): any {
  return i18n.getLocales().filter(locale => locale in Locale).map(locale => ({
    [Locale[locale as keyof typeof Locale]]: translate(locale, key, params)
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
}
