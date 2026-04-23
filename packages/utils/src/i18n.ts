import type { AppLocale } from "@rental/config";

export const isRtlLocale = (locale: AppLocale) => locale === "he";

export const dirForLocale = (locale: AppLocale) => (isRtlLocale(locale) ? "rtl" : "ltr");
