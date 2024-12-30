export const locale = {
  defaultLocale: 'en',
  locales: ['en', 'sk'],
} as const

export type Locale = (typeof locale)['locales'][number]
