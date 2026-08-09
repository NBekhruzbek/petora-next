import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Drawer, Stack, Typography, useMediaQuery } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_DASHBOARD_STATS } from "@/apollo/admin/query";
import { AdminDashboardStats } from "@/libs/types/admin/admin";
import { adminNavItems, isAdminNavActive, AdminNavItem } from "./adminNav";

const AdminMobileNav = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data } = useQuery(GET_ADMIN_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
    skip: !isMobile,
  });

  useEffect(() => setOpen(false), [router.pathname]);

  if (!isMobile) return null;

  const stats: AdminDashboardStats | undefined = data?.getAdminDashboardStats;

  const pendingFor = (item: AdminNavItem) => {
    if (item.pending === "orders") return stats?.pendingOrders ?? 0;
    if (item.pending === "bookings") return stats?.pendingBookings ?? 0;
    return 0;
  };

  const waiting = adminNavItems.reduce(
    (sum, item) => sum + pendingFor(item),
    0,
  );

  const current =
    adminNavItems.find((item) =>
      isAdminNavActive(router.pathname, item.href),
    ) ?? adminNavItems[0];

  const go = (href: string) => {
    setOpen(false);
    if (href !== router.pathname) router.push(href);
  };

  const renderTile = (item: AdminNavItem) => {
    const active = isAdminNavActive(router.pathname, item.href);
    const pending = pendingFor(item);

    return (
      <button
        key={item.href}
        type="button"
        className={`admin-mnav-tile${active ? " active" : ""}`}
        aria-current={active ? "page" : undefined}
        onClick={() => go(item.href)}
      >
        <span className="admin-mnav-tile-icon">
          {item.icon}
          {pending > 0 && (
            <span className="admin-mnav-tile-dot" aria-hidden="true" />
          )}
        </span>
        <span className="admin-mnav-tile-label">{t(item.labelKey)}</span>
      </button>
    );
  };

  return (
    <>
      <Stack className="admin-mobile-bar">
        <button
          type="button"
          className="admin-mobile-bar-btn"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={t("admin.mobile.changeSection")}
          onClick={() => setOpen(true)}
        >
          <span className="admin-mobile-bar-icon">{current.icon}</span>
          <span className="admin-mobile-bar-label">{t(current.labelKey)}</span>
          {waiting > 0 && (
            <span className="admin-mobile-bar-waiting">
              {t("admin.mobile.waiting", { count: waiting })}
            </span>
          )}
          <KeyboardArrowUpIcon className="admin-mobile-bar-chevron" />
        </button>
      </Stack>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: "admin-mnav-sheet-paper" }}
        className="admin-mnav-sheet"
        disablePortal
      >
        <Stack className="admin-mnav-sheet-inner">
          <span className="admin-mnav-grabber" aria-hidden="true" />

          <Typography className="admin-mnav-section-label">
            {t("admin.sectionMain")}
          </Typography>

          <Stack className="admin-mnav-grid admin-mnav-grid--wide">
            {adminNavItems.filter((i) => i.section === "main").map(renderTile)}
          </Stack>

          <Typography className="admin-mnav-section-label">
            {t("admin.sectionManagement")}
          </Typography>
          <Stack className="admin-mnav-grid">
            {adminNavItems
              .filter((i) => i.section === "management")
              .map(renderTile)}
          </Stack>

          <button
            type="button"
            className="admin-mnav-exit"
            onClick={() => router.push("/")}
          >
            <LogoutIcon />
            <span>{t("admin.backToSite")}</span>
          </button>
        </Stack>
      </Drawer>
    </>
  );
};

export default AdminMobileNav;
