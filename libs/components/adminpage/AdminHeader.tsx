import { useTranslation } from "react-i18next";
import { Stack, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";

const pageNameKeys: Record<string, string> = {
  "/admin": "admin.nav.dashboard",
  "/admin/users": "admin.nav.users",
  "/admin/agents": "admin.nav.agents",
  "/admin/products": "admin.nav.products",
  "/admin/services": "admin.nav.services",
  "/admin/orders": "admin.nav.orders",
  "/admin/bookings": "admin.nav.bookings",
  "/admin/community": "admin.nav.community",
  "/admin/cs": "admin.nav.cs",
};

const AdminHeader = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const pageNameKey = pageNameKeys[router.pathname] ?? "admin.panel";
  const adminName = user?.memberFullName || user?.memberUserName || "Admin";

  return (
    <Stack className="admin-header" direction="row" alignItems="center">
      <Stack className="admin-header-left" direction="row" alignItems="center">
        <Typography className="admin-header-breadcrumb">Petora</Typography>
        <Typography className="admin-header-sep">/</Typography>
        <Typography className="admin-header-title">{t(pageNameKey)}</Typography>
      </Stack>

      <Stack className="admin-header-right" direction="row" alignItems="center">
        <Stack className="admin-header-avatar">
          {adminName.charAt(0).toUpperCase()}
        </Stack>
        <Typography className="admin-header-name">{adminName}</Typography>
        <Button
          className="admin-header-logout"
          onClick={() => router.push("/")}
          startIcon={<LogoutIcon />}
        >
          {t("admin.exit")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdminHeader;
