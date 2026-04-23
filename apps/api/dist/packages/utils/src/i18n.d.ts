import type { AppLocale } from "@rental/config";
export declare const isRtlLocale: (locale: AppLocale) => locale is "he";
export declare const dirForLocale: (locale: AppLocale) => "rtl" | "ltr";
