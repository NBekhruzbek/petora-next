import { themeVar } from "@/apollo/store";

export type ColorScheme = "light" | "dark";
export const COLOR_SCHEME_STORAGE_KEY = "petora-color-scheme";

const isColorScheme = (value: unknown): value is ColorScheme =>
  value === "light" || value === "dark";

export const applyColorScheme = (scheme: ColorScheme) => {
  themeVar(scheme);
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = scheme;
  try {
    window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
  } catch {
    // Quota / private-mode failures shouldn't take the toggle down with them.
  }
};

export const toggleColorScheme = () =>
  applyColorScheme(themeVar() === "dark" ? "light" : "dark");

let hydrated = false;

export const hydrateColorScheme = () => {
  if (hydrated || typeof document === "undefined") return;
  hydrated = true;
  const applied = document.documentElement.dataset.theme;
  if (isColorScheme(applied)) themeVar(applied);
};
