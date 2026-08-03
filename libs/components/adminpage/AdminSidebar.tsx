import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InventoryIcon from "@mui/icons-material/Inventory";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ForumIcon from "@mui/icons-material/Forum";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ExploreIcon from "@mui/icons-material/Explore";

import LogoutIcon from "@mui/icons-material/Logout";
import PetsIcon from "@mui/icons-material/Pets";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface NavItem {
  labelKey: string;
  icon: ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { labelKey: "admin.nav.dashboard", icon: <DashboardIcon />, href: "/admin" },
  {
    labelKey: "admin.nav.users",
    icon: <PeopleAltIcon />,
    href: "/admin/users",
  },
  {
    labelKey: "admin.nav.agents",
    icon: <SupportAgentIcon />,
    href: "/admin/agents",
  },
  {
    labelKey: "admin.nav.products",
    icon: <InventoryIcon />,
    href: "/admin/products",
  },
  {
    labelKey: "admin.nav.discovery",
    icon: <ExploreIcon />,
    href: "/admin/discovery",
  },
  {
    labelKey: "admin.nav.services",
    icon: <RoomServiceIcon />,
    href: "/admin/services",
  },
  {
    labelKey: "admin.nav.orders",
    icon: <ShoppingCartIcon />,
    href: "/admin/orders",
  },
  {
    labelKey: "admin.nav.bookings",
    icon: <EventAvailableIcon />,
    href: "/admin/bookings",
  },
  {
    labelKey: "admin.nav.community",
    icon: <ForumIcon />,
    href: "/admin/community",
  },
  { labelKey: "admin.nav.cs", icon: <HeadsetMicIcon />, href: "/admin/cs" },
];

const AdminSidebar = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/admin"
      ? router.pathname === "/admin"
      : router.pathname.startsWith(href);

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
        {navItems.slice(0, 1).map((item) => (
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
        ))}

        <Typography className="admin-nav-section-label">
          {t("admin.sectionManagement")}
        </Typography>
        {navItems.slice(1).map((item) => (
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
        ))}
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
