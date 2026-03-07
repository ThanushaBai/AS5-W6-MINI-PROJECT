import {getRequestConfig} from "next-intl/server";

export const locales = ["en", "fr"];
export const defaultLocale = "en";

export default getRequestConfig(async ({locale}) => {

  const currentLocale = locale ?? defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default
  };
});