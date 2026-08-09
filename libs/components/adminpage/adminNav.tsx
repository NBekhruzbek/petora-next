import { ReactNode } from "react";
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

export interface AdminNavItem {
  labelKey: string;
  icon: ReactNode;
  href: string;
  section: "main" | "management";
  pending?: "orders" | "bookings";
}

export const adminNavItems: AdminNavItem[] = [
  {
    labelKey: "admin.nav.dashboard",
    icon: <DashboardIcon />,
    href: "/admin",
    section: "main",
  },
  {
    labelKey: "admin.nav.users",
    icon: <PeopleAltIcon />,
    href: "/admin/users",
    section: "management",
  },
  {
    labelKey: "admin.nav.agents",
    icon: <SupportAgentIcon />,
    href: "/admin/agents",
    section: "management",
  },
  {
    labelKey: "admin.nav.products",
    icon: <InventoryIcon />,
    href: "/admin/products",
    section: "management",
  },
  {
    labelKey: "admin.nav.discovery",
    icon: <ExploreIcon />,
    href: "/admin/discovery",
    section: "management",
  },
  {
    labelKey: "admin.nav.services",
    icon: <RoomServiceIcon />,
    href: "/admin/services",
    section: "management",
  },
  {
    labelKey: "admin.nav.orders",
    icon: <ShoppingCartIcon />,
    href: "/admin/orders",
    section: "management",
    pending: "orders",
  },
  {
    labelKey: "admin.nav.bookings",
    icon: <EventAvailableIcon />,
    href: "/admin/bookings",
    section: "management",
    pending: "bookings",
  },
  {
    labelKey: "admin.nav.community",
    icon: <ForumIcon />,
    href: "/admin/community",
    section: "management",
  },
  {
    labelKey: "admin.nav.cs",
    icon: <HeadsetMicIcon />,
    href: "/admin/cs",
    section: "management",
  },
];

export const isAdminNavActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
