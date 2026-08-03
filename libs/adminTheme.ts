import { adminThemeVar } from "@/apollo/store";
import { ColorScheme } from "@/libs/theme";

export const ADMIN_COLOR_SCHEME_STORAGE_KEY = "petora-admin-color-scheme";

const isColorScheme = (value: unknown): value is ColorScheme =>
  value === "light" || value === "dark";

export const applyAdminColorScheme = (scheme: ColorScheme) => {
  adminThemeVar(scheme);
  if (typeof document === "undefined") return;
  document.documentElement.dataset.adminTheme = scheme;
  try {
    window.localStorage.setItem(ADMIN_COLOR_SCHEME_STORAGE_KEY, scheme);
  } catch {
    // Quota / private-mode failures shouldn't take the toggle down with them.
  }
};

export const toggleAdminColorScheme = () =>
  applyAdminColorScheme(adminThemeVar() === "dark" ? "light" : "dark");

let hydrated = false;

export const hydrateAdminColorScheme = () => {
  if (hydrated || typeof document === "undefined") return;
  hydrated = true;

  const applied = document.documentElement.dataset.adminTheme;
  if (isColorScheme(applied)) {
    adminThemeVar(applied);
    return;
  }

  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(ADMIN_COLOR_SCHEME_STORAGE_KEY);
  } catch {
    // Private-mode / disabled storage — fall through to the default.
  }
  if (isColorScheme(stored)) applyAdminColorScheme(stored);
};
