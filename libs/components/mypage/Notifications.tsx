import { ChangeEvent, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Pagination,
  PaginationItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import CloseIcon from "@mui/icons-material/Close";

export type NotificationType =
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REMINDER"
  | "BOOKING_COMPLETED"
  | "ORDER_CONFIRMED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "SYSTEM_INFO";

export type NotificationTab = "ALL" | "ORDERS" | "BOOKINGS" | "SYSTEM";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    type: "BOOKING_CONFIRMED",
    title: "Booking Confirmed",
    message:
      "Your booking for Premium Dog Grooming on May 15, 2026 at 10:00 AM has been confirmed by the service agent.",
    timeAgo: "2 minutes ago",
    read: false,
    actionLabel: "View Booking",
  },
  {
    id: "n-2",
    type: "ORDER_CONFIRMED",
    title: "Order Confirmed",
    message:
      "Your order #PO-2841 for Royal Canin Care Digest & Paw Care Bundle has been confirmed and is being prepared for shipment.",
    timeAgo: "30 minutes ago",
    read: false,
    actionLabel: "View Order",
  },
  {
    id: "n-3",
    type: "BOOKING_REMINDER",
    title: "Upcoming Appointment Reminder",
    message:
      "You have a Dog Walking session scheduled for tomorrow at 9:00 AM. Please be ready 5 minutes in advance.",
    timeAgo: "1 hour ago",
    read: false,
    actionLabel: "View Details",
  },
  {
    id: "n-4",
    type: "ORDER_CANCELLED",
    title: "Order Cancelled",
    message:
      "Your order #PO-2795 for Kitty Feather Play Set has been cancelled as requested. A full refund of ₩85,000 will be processed within 3–5 business days.",
    timeAgo: "3 hours ago",
    read: false,
    actionLabel: "Reorder",
  },
  {
    id: "n-5",
    type: "ORDER_SHIPPED",
    title: "Order Shipped",
    message:
      "Your order #PO-2801 is on its way! Estimated delivery: May 16, 2026. Track your package with code TRK-9284-KR.",
    timeAgo: "5 hours ago",
    read: true,
    actionLabel: "Track Order",
  },
  {
    id: "n-6",
    type: "BOOKING_CANCELLED",
    title: "Booking Cancelled",
    message:
      "Unfortunately, your booking for Basic Obedience Training on May 12 has been cancelled by the service agent. A full refund has been processed.",
    timeAgo: "Yesterday",
    read: true,
    actionLabel: "Rebook",
  },
  {
    id: "n-7",
    type: "ORDER_DELIVERED",
    title: "Order Delivered",
    message:
      "Your order #PO-2788 has been successfully delivered. We hope your pet loves their new FILLET 'O' LAKES – Kit Cat treats!",
    timeAgo: "Yesterday",
    read: true,
  },
  {
    id: "n-8",
    type: "BOOKING_COMPLETED",
    title: "Service Completed",
    message:
      "Your Full Day Pet Day Care session on May 10 has been marked as completed. We hope your pet had a great time!",
    timeAgo: "2 days ago",
    read: true,
  },
  {
    id: "n-9",
    type: "SYSTEM_INFO",
    title: "Profile Verification Approved",
    message:
      "Your account has been successfully verified. You now have access to premium service listings and priority booking.",
    timeAgo: "3 days ago",
    read: true,
  },
  {
    id: "n-10",
    type: "ORDER_CONFIRMED",
    title: "Order Confirmed",
    message:
      "Your order #PO-2776 for Hamster Tunnel Play Kit & Pet Vitamin Daily Drops has been confirmed. Payment of ₩220,000 received.",
    timeAgo: "4 days ago",
    read: true,
    actionLabel: "View Order",
  },
  {
    id: "n-11",
    type: "BOOKING_REMINDER",
    title: "Don't Forget Your Appointment",
    message:
      "Reminder: You have a Vet Check-Up & Vaccines session on May 8 at 2:00 PM. Please arrive 10 minutes early.",
    timeAgo: "5 days ago",
    read: true,
  },
];

const ITEMS_PER_PAGE = 8;

const typeToTab: Record<NotificationType, NotificationTab> = {
  ORDER_CONFIRMED: "ORDERS",
  ORDER_SHIPPED: "ORDERS",
  ORDER_DELIVERED: "ORDERS",
  ORDER_CANCELLED: "ORDERS",
  BOOKING_CONFIRMED: "BOOKINGS",
  BOOKING_CANCELLED: "BOOKINGS",
  BOOKING_REMINDER: "BOOKINGS",
  BOOKING_COMPLETED: "BOOKINGS",
  SYSTEM_INFO: "SYSTEM",
};

const tabIndexMap: NotificationTab[] = ["ALL", "ORDERS", "BOOKINGS", "SYSTEM"];

const typeLabel: Record<NotificationType, string> = {
  BOOKING_CONFIRMED: "Booking",
  BOOKING_CANCELLED: "Booking",
  BOOKING_REMINDER: "Booking",
  BOOKING_COMPLETED: "Booking",
  ORDER_CONFIRMED: "Order",
  ORDER_SHIPPED: "Order",
  ORDER_DELIVERED: "Order",
  ORDER_CANCELLED: "Order",
  SYSTEM_INFO: "System",
};

function getIcon(type: NotificationType, large = false) {
  const cls = large ? "notif-icon-lg" : "notif-icon";
  switch (type) {
    case "BOOKING_CONFIRMED":
      return <CheckCircleOutlineIcon className={`${cls} confirmed`} />;
    case "BOOKING_CANCELLED":
      return <CancelOutlinedIcon className={`${cls} cancelled`} />;
    case "BOOKING_REMINDER":
      return <CalendarTodayOutlinedIcon className={`${cls} reminder`} />;
    case "BOOKING_COMPLETED":
      return <CheckCircleOutlineIcon className={`${cls} completed`} />;
    case "ORDER_CONFIRMED":
      return <ShoppingBagOutlinedIcon className={`${cls} order-confirmed`} />;
    case "ORDER_SHIPPED":
      return <LocalShippingOutlinedIcon className={`${cls} order-shipped`} />;
    case "ORDER_DELIVERED":
      return <Inventory2OutlinedIcon className={`${cls} order-delivered`} />;
    case "ORDER_CANCELLED":
      return (
        <RemoveShoppingCartOutlinedIcon className={`${cls} order-cancelled`} />
      );
    case "SYSTEM_INFO":
      return <InfoOutlinedIcon className={`${cls} system-info`} />;
  }
}

const Notifications = () => {
  const [items, setItems] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null,
  );
  const topRef = useRef<HTMLDivElement | null>(null);

  const activeTabKey = tabIndexMap[activeTab];

  const filtered = items.filter((n) => {
    const matchesTab =
      activeTabKey === "ALL" || typeToTab[n.type] === activeTabKey;
    const matchesFilter = !showUnreadOnly || !n.read;
    return matchesTab && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pagedItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleTabChange = (_: React.SyntheticEvent, val: number) => {
    setActiveTab(val);
    setPage(1);
  };

  const handlePageChange = (_: ChangeEvent<unknown>, val: number) => {
    setPage(val);
    if (!topRef.current) return;
    const scrollTarget =
      window.scrollY + topRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const handleCardClick = (notif: NotificationItem) => {
    setSelectedNotif(notif);
    if (!notif.read) {
      setItems((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
      );
    }
  };

  const handleCloseDialog = () => setSelectedNotif(null);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleUnread = () => {
    setShowUnreadOnly((prev) => !prev);
    setPage(1);
  };

  return (
    <Stack className="notifications-container" ref={topRef}>
      <Stack className="notifications-toolbar">
        <Stack direction="row" alignItems="center" gap="10px">
          <Typography className="notifications-count">
            {filtered.length} Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              className="unread-chip"
              onClick={handleToggleUnread}
              color={showUnreadOnly ? "primary" : "default"}
            />
          )}
        </Stack>
        {unreadCount > 0 && (
          <Button
            className="btn-mark-all-read"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </Button>
        )}
      </Stack>

      <Box className="notifications-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="notification tabs"
        >
          <Tab label="All" />
          <Tab label="Orders" />
          <Tab label="Bookings" />
          <Tab label="System" />
        </Tabs>
      </Box>

      <Stack className="notifications-list">
        {pagedItems.length === 0 ? (
          <Stack className="notifications-empty">
            <NotificationsOutlinedIcon className="empty-icon" />
            <Typography className="empty-title">No notifications</Typography>
            <Typography className="empty-subtitle">
              {showUnreadOnly
                ? "You're all caught up! No unread notifications."
                : "Nothing here yet. Check back later."}
            </Typography>
          </Stack>
        ) : (
          pagedItems.map((notif) => (
            <Stack
              key={notif.id}
              className={`notification-item ${notif.read ? "read" : "unread"}`}
              direction="row"
              alignItems="flex-start"
              gap="14px"
              onClick={() => handleCardClick(notif)}
            >
              <Stack className="notif-icon-wrap">{getIcon(notif.type)}</Stack>

              <Stack className="notif-body" flex={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="8px"
                >
                  <Typography className="notif-title">{notif.title}</Typography>
                  <Stack direction="row" alignItems="center" gap="8px">
                    {!notif.read && <span className="unread-dot" />}
                    <Typography className="notif-time">
                      {notif.timeAgo}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography className="notif-message">{notif.message}</Typography>
              </Stack>
            </Stack>
          ))
        )}
      </Stack>

      {filtered.length > ITEMS_PER_PAGE && (
        <Stack className="pagination-section">
          <Pagination
            count={totalPages}
            page={page}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
                color="primary"
              />
            )}
            onChange={handlePageChange}
          />
        </Stack>
      )}

      <Dialog
        open={Boolean(selectedNotif)}
        onClose={handleCloseDialog}
        className="notif-dialog"
        PaperProps={{ className: "notif-dialog-paper" }}
      >
        {selectedNotif && (
          <>
            <Stack className="notif-dialog-header">
              <Chip
                label={typeLabel[selectedNotif.type]}
                size="small"
                className="notif-dialog-chip"
              />
              <IconButton
                className="notif-dialog-close"
                onClick={handleCloseDialog}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack className="notif-dialog-body">
              <Stack direction="row" alignItems="flex-start" gap="14px">
                <Stack className="notif-dialog-icon-wrap">
                  {getIcon(selectedNotif.type, true)}
                </Stack>
                <Stack gap="4px">
                  <Typography className="notif-dialog-title">
                    {selectedNotif.title}
                  </Typography>
                  <Typography className="notif-dialog-time">
                    {selectedNotif.timeAgo}
                  </Typography>
                </Stack>
              </Stack>
              <Typography className="notif-dialog-message">
                {selectedNotif.message}
              </Typography>
            </Stack>

          </>
        )}
      </Dialog>
    </Stack>
  );
};

export default Notifications;
