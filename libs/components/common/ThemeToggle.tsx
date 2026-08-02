import { useReactiveVar } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { themeVar } from "@/apollo/store";
import { applyColorScheme, toggleColorScheme } from "@/libs/theme";

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const SchemeGlyph = ({ face }: { face?: "sun" | "moon" }) => (
  <svg
    className={`scheme-glyph${face ? ` scheme-glyph--${face}` : ""}`}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <g className="scheme-glyph__rays">
      {RAY_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <line x1="12" y1="2.9" x2="12" y2="4.9" />
        </g>
      ))}
    </g>
    <circle className="scheme-glyph__disc" cx="12" cy="12" r="4.4" />
    <path
      className="scheme-glyph__crescent"
      d="M19.83 12.69A7.83 7.83 0 1 1 11.31 4.17 6.09 6.09 0 0 0 19.83 12.69Z"
    />
  </svg>
);

const PawSpecks = () => (
  <svg
    className="theme-toggle__specks"
    viewBox="0 0 52 28"
    aria-hidden="true"
    focusable="false"
  >
    {[
      { x: 8, y: 8.5, s: 0.6, r: -18, o: 0.9 },
      { x: 17.5, y: 18, s: 0.42, r: 14, o: 0.6 },
      { x: 21, y: 7, s: 0.32, r: 28, o: 0.42 },
    ].map(({ x, y, s, r, o }) => (
      <g
        key={`${x}-${y}`}
        transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
        opacity={o}
      >
        <ellipse cx="0" cy="2.6" rx="2.7" ry="2.3" />
        <circle cx="-2.9" cy="-1.9" r="1.2" />
        <circle cx="0" cy="-3" r="1.25" />
        <circle cx="2.9" cy="-1.9" r="1.2" />
      </g>
    ))}
  </svg>
);

interface ThemeToggleProps {
  variant?: "switch" | "two-up";
}

const ThemeToggle = ({ variant = "switch" }: ThemeToggleProps) => {
  const { t } = useTranslation();
  const isDark = useReactiveVar(themeVar) === "dark";

  if (variant === "two-up") {
    return (
      <Stack
        className="theme-two-up"
        direction="row"
        role="group"
        aria-label={t("theme.appearance")}
      >
        <button
          type="button"
          className={isDark ? "" : "active"}
          aria-pressed={!isDark}
          onClick={() => applyColorScheme("light")}
        >
          <SchemeGlyph face="sun" />
          {t("theme.light")}
        </button>
        <button
          type="button"
          className={isDark ? "active" : ""}
          aria-pressed={isDark}
          onClick={() => applyColorScheme("dark")}
        >
          <SchemeGlyph face="moon" />
          {t("theme.dark")}
        </button>
      </Stack>
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={isDark}
      aria-label={t("theme.darkMode")}
      title={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
      onClick={toggleColorScheme}
    >
      <span className="theme-toggle__track">
        <PawSpecks />
        <span className="theme-toggle__thumb">
          <SchemeGlyph />
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
