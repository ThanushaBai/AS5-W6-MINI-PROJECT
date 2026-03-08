export const locales = ["en", "hi", "fr", "kn", "ar"] as const;
export const defaultLocale = "en";

export type AppLocale = (typeof locales)[number];