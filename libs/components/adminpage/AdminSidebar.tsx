import { Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InventoryIcon from "@mui/icons-material/Inventory";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ForumIcon from "@mui/icons-material/Forum";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

import LogoutIcon from "@mui/icons-material/Logout";
import PetsIcon from "@mui/icons-material/Pets";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/admin" },
  { label: "Users", icon: <PeopleAltIcon />, href: "/admin/users" },
  { label: "Agents", icon: <SupportAgentIcon />, href: "/admin/agents" },
  { label: "Products", icon: <InventoryIcon />, href: "/admin/products" },
  { label: "Services", icon: <RoomServiceIcon />, href: "/admin/services" },
  { label: "Orders", icon: <ShoppingCartIcon />, href: "/admin/orders" },
  { label: "Community", icon: <ForumIcon />, href: "/admin/community" },
  { label: "CS Support", icon: <HeadsetMicIcon />, href: "/admin/cs" },
];

const AdminSidebar = () => {
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
          <span className="brand-badge">Admin Panel</span>
        </Stack>
      </Stack>

      <Stack className="admin-sidebar-nav">
        <Typography className="admin-nav-section-label">Main</Typography>
        {navItems.slice(0, 1).map((item) => (
          <Stack
            key={item.href}
            className={`admin-nav-item${isActive(item.href) ? " active" : ""}`}
            direction="row"
            alignItems="center"
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
          </Stack>
        ))}

        <Typography className="admin-nav-section-label">Management</Typography>
        {navItems.slice(1).map((item) => (
          <Stack
            key={item.href}
            className={`admin-nav-item${isActive(item.href) ? " active" : ""}`}
            direction="row"
            alignItems="center"
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
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
          <span>Back to Site</span>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AdminSidebar;
