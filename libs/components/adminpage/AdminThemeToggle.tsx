import { useReactiveVar } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { adminThemeVar } from "@/apollo/store";
import { toggleAdminColorScheme } from "@/libs/adminTheme";

const AdminThemeToggle = () => {
  const { t } = useTranslation();
  const isDark = useReactiveVar(adminThemeVar) === "dark";

  return (
    <IconButton
      className="admin-header-theme-toggle"
      onClick={toggleAdminColorScheme}
      aria-label={t("theme.darkMode")}
      title={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
      disableRipple
    >
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default AdminThemeToggle;
