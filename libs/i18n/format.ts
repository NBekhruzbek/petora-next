import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { defaultLocale, isAppLocale } from "./index";

/** BCP-47 tag for Intl APIs, derived from the active i18next language. */
export const useIntlLocale = () => {
  const { i18n } = useTranslation();
  const lng = isAppLocale(i18n.language) ? i18n.language : defaultLocale;
  return lng === "ko" ? "ko-KR" : "en-US";
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * `Intl.RelativeTimeFormat` equivalent of moment's `fromNow()`.
 *
 * Intl handles plural rules and locale wording ("yesterday" / "어제") itself,
 * which hand-built `${n} day${n > 1 ? "s" : ""} ago` strings cannot. Using it
 * everywhere also drops the dependency on moment's locale files — those are
 * loaded through a dynamic `require` that has no type declarations, so a
 * side-effect `import "moment/locale/ko"` fails to resolve under
 * `moduleResolution: bundler`.
 */
export const relativeTime = (value: Date | string, locale: string) => {
  const elapsed = Date.now() - new Date(value).getTime();

  // `auto` is what turns -1 into "yesterday" / "어제", which reads better than
  // "1 day ago". It is deliberately NOT used for coarser units: -1 week renders
  // as "last week" for anything 7–13 days old, and -1 month as "last month" for
  // anything 30–59 days old, both of which are misleading.
  const auto = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const always = new Intl.RelativeTimeFormat(locale, { numeric: "always" });

  // Thresholds mirror moment's (45s / 45min / 22h / 26d), so moving off
  // `fromNow()` did not change which unit a given age reports in.
  if (elapsed < 45 * SECOND) return auto.format(0, "second");
  if (elapsed < 45 * MINUTE)
    return always.format(-Math.round(elapsed / MINUTE), "minute");
  if (elapsed < 22 * HOUR)
    return always.format(-Math.round(elapsed / HOUR), "hour");
  if (elapsed < 26 * DAY) {
    const days = Math.round(elapsed / DAY);
    return days === 1 ? auto.format(-1, "day") : always.format(-days, "day");
  }
  if (elapsed < 320 * DAY) {
    const months = Math.max(1, Math.round(elapsed / (30 * DAY)));
    return always.format(-months, "month");
  }
  return always.format(-Math.max(1, Math.round(elapsed / (365 * DAY))), "year");
};

/** Medium-length localised date — the equivalent of moment's `format("ll")`. */
export const mediumDate = (value: Date | string, locale: string) =>
  new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/** Locale-bound helpers, so components do not thread the tag through by hand. */
export const useDateFormat = () => {
  const locale = useIntlLocale();
  return useMemo(
    () => ({
      locale,
      fromNow: (value: Date | string) => relativeTime(value, locale),
      medium: (value: Date | string) => mediumDate(value, locale),
    }),
    [locale],
  );
};
