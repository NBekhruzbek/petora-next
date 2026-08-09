import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PetsIcon from "@mui/icons-material/Pets";
import { useRouter } from "next/router";
import { adminNavItems, isAdminNavActive } from "./adminNav";

const AdminSidebar = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const isActive = (href: string) => isAdminNavActive(router.pathname, href);

  const renderItems = (section: "main" | "management") =>
    adminNavItems
      .filter((item) => item.section === section)
      .map((item) => (
        <Stack
          key={item.href}
          className={`admin-nav-item${isActive(item.href) ? " active" : ""}`}
          direction="row"
          alignItems="center"
          onClick={() => router.push(item.href)}
        >
          {item.icon}
          <span>{t(item.labelKey)}</span>
        </Stack>
      ));

  return (
    <Stack className="admin-sidebar">
      <Stack
        className="admin-sidebar-brand"
        direction="row"
        alignItems="center"
      >
        <Stack className="brand-icon">
          <PetsIcon />
        </Stack>
        <Stack className="brand-text-wrap">
          <span className="brand-name">Petora</span>
          <span className="brand-badge">{t("admin.panel")}</span>
        </Stack>
      </Stack>

      <Stack className="admin-sidebar-nav">
        <Typography className="admin-nav-section-label">
          {t("admin.sectionMain")}
        </Typography>
        {renderItems("main")}

        <Typography className="admin-nav-section-label">
          {t("admin.sectionManagement")}
        </Typography>
        {renderItems("management")}
      </Stack>

      <Stack className="admin-sidebar-footer">
        <Stack
          className="admin-nav-item"
          direction="row"
          alignItems="center"
          onClick={() => router.push("/")}
        >
          <LogoutIcon />
          <span>{t("admin.backToSite")}</span>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AdminSidebar;
