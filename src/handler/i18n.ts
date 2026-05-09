import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import i18next from 'i18next';

const __dirname = dirname(fileURLToPath(import.meta.url));
const locales = ['en_US', 'ko'] as const;
const resources = Object.fromEntries(
  locales.map((locale) => [locale, { translation: JSON.parse(readFileSync(resolve(__dirname, `../locales/${locale}.json`), 'utf-8')) }])
);

await i18next.init({
  lng: 'ko',
  fallbackLng: 'ko',
  resources,
  interpolation: { escapeValue: false },
  returnNull: false
});

export default i18next;
