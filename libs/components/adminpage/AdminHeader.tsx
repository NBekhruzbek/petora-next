import { Stack, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";

const pageNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/agents": "Agents",
  "/admin/products": "Products",
  "/admin/services": "Services",
  "/admin/orders": "Orders",
  "/admin/bookings": "Bookings",
  "/admin/community": "Community",
  "/admin/cs": "CS Support",
};

const AdminHeader = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const pageName = pageNames[router.pathname] ?? "Admin";
  const adminName =
    user?.memberFullName || user?.memberUserName || "Admin";

  return (
    <Stack className="admin-header" direction="row" alignItems="center">
      <Stack className="admin-header-left" direction="row" alignItems="center">
        <Typography className="admin-header-breadcrumb">Petora</Typography>
        <Typography className="admin-header-sep">/</Typography>
        <Typography className="admin-header-title">{pageName}</Typography>
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
          Exit
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdminHeader;
