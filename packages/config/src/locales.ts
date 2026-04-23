export const DEFAULT_LOCALE = "he";

export const SUPPORTED_LOCALES = ["he", "en"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  he: "עברית",
  en: "English",
};
