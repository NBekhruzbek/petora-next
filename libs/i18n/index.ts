import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enService from "./locales/en/service.json";
import enShop from "./locales/en/shop.json";

import koCommon from "./locales/ko/common.json";
import koHome from "./locales/ko/home.json";
import koService from "./locales/ko/service.json";
import koShop from "./locales/ko/shop.json";

export const locales = ["en", "ko"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const isAppLocale = (value?: string): value is AppLocale =>
  locales.includes(value as AppLocale);

type Tree = { [key: string]: string | Tree };

/**
 * Deep, not shallow. Locale files are split per page so each one can be
 * reviewed and committed on its own, but several contribute to the same
 * top-level `headers` object — a spread would keep only the last file's copy.
 */
const merge = (...parts: Tree[]): Tree =>
  parts.reduce<Tree>((acc, part) => {
    for (const [key, value] of Object.entries(part)) {
      const existing = acc[key];
      acc[key] =
        typeof value === "object" && typeof existing === "object"
          ? merge(existing, value)
          : value;
    }
    return acc;
  }, {});

// One namespace ("common") assembled from the per-page files; keys keep their
// existing prefixes (home.*, mypage.*, …) so components are unaffected.
const resources = {
  en: {
    common: merge(enCommon, enHome, enService, enShop),
  },
  ko: {
    common: merge(koCommon, koHome, koService, koShop),
  },
};

const createForLocale = (lng: AppLocale): I18nInstance => {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: defaultLocale,
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    // Keeps init synchronous — this is `initImmediate` renamed in i18next v26.
    // Left async, the server can render raw keys ("headers.main.eyebrow")
    // while the client renders real text, which is a hydration mismatch.
    initAsync: false,
  });
  return instance;
};

/**
 * One fully-initialised instance per locale, built at module load.
 *
 * A single instance plus `changeLanguage()` is a trap here: it mutates shared
 * state during render, and on the server a concurrent request for the other
 * locale can flip the language out from under an in-flight render. Extra
 * instances are cheap because every namespace is already in the bundle.
 */
const instances: Record<AppLocale, I18nInstance> = {
  en: createForLocale("en"),
  ko: createForLocale("ko"),
};

/** Instance for a Next.js locale; falls back for unknown or missing values. */
export const getI18n = (locale?: string): I18nInstance =>
  instances[isAppLocale(locale) ? locale : defaultLocale];

export default instances[defaultLocale];
