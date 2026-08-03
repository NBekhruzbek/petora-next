import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import {
  type AppLocale,
  defaultLocale,
  isAppLocale,
  locales,
} from "@/libs/i18n";

const flagFor = (l: AppLocale) => (l === "en" ? "us" : "kr");

const AdminLangSwitcher = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  const lang: AppLocale = isAppLocale(router.locale)
    ? router.locale
    : defaultLocale;

  const changeLanguage = (next: AppLocale) => {
    setAnchor(null);
    if (next === lang) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    void router.push(router.asPath, router.asPath, { locale: next });
  };

  return (
    <>
      <Box
        className="admin-header-lang-switcher"
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <img
          src={`https://flagcdn.com/w20/${flagFor(lang)}.png`}
          width={16}
          height={12}
          alt={lang}
        />
        <Typography className="admin-header-lang-label">
          {t(`language.${lang}Short`)}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        disableScrollLock
        sx={{ mt: "8px" }}
        slotProps={{
          paper: { elevation: 0, className: "admin-lang-menu-paper" },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        MenuListProps={{ sx: { p: 0 } }}
      >
        {locales.map((l) => (
          <MenuItem
            key={l}
            selected={lang === l}
            onClick={() => changeLanguage(l)}
            className="admin-lang-menu-item"
          >
            <img
              src={`https://flagcdn.com/w20/${flagFor(l)}.png`}
              width={16}
              height={12}
              alt={l}
            />
            {t(`language.${l}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AdminLangSwitcher;
