import {getRequestConfig} from "next-intl/server";
import { defaultLocale } from "@/config/locales";

export default getRequestConfig(async ({locale}) => {

  const currentLocale = locale ?? defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default
  };
});
