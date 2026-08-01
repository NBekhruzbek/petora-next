import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import { mediumDate, relativeTime } from "@/libs/i18n/format";
import {
  NotificationGroup,
  NotificationType,
} from "@/libs/enums/notification.enum";

const MY_BOOKINGS = "/mypage?category=ORDERS_BOOKINGS&tab=BOOKINGS";
const MY_ORDERS = "/mypage?category=ORDERS_BOOKINGS&tab=ORDERS";
export const BOOKING_REQUESTS =
  "/mypage?category=SERVICE_MANAGEMENT&tab=REQUESTS";

export const ALL_NOTIFICATIONS = "/mypage?category=NOTIFICATIONS";

export const DESTINATIONS: Partial<
  Record<NotificationType, { label: string; href: string }>
> = {
  [NotificationType.BOOKING_CREATED]: {
    label: "View request",
    href: BOOKING_REQUESTS,
  },
  [NotificationType.BOOKING_CONFIRMED]: {
    label: "View booking",
    href: MY_BOOKINGS,
  },
  [NotificationType.BOOKING_REJECTED]: {
    label: "View booking",
    href: MY_BOOKINGS,
  },
  [NotificationType.REVIEW_REQUESTED]: {
    label: "View booking",
    href: MY_BOOKINGS,
  },
  [NotificationType.ORDER_CREATED]: {
    label: "View order",
    href: MY_ORDERS,
  },
  [NotificationType.ORDER_PAID]: {
    label: "View order",
    href: MY_ORDERS,
  },
  [NotificationType.ORDER_SHIPPED]: {
    label: "View order",
    href: MY_ORDERS,
  },
  [NotificationType.ORDER_DELIVERED]: {
    label: "View order",
    href: MY_ORDERS,
  },
  [NotificationType.ORDER_CANCELLED]: {
    label: "View order",
    href: MY_ORDERS,
  },
};

export const groupLabel: Record<NotificationGroup, string> = {
  [NotificationGroup.ORDERS]: "Order",
  [NotificationGroup.BOOKINGS]: "Booking",
  [NotificationGroup.SYSTEM]: "System",
};

export function getNotificationIcon(type: NotificationType, large = false) {
  const cls = large ? "notif-icon-lg" : "notif-icon";
  switch (type) {
    case NotificationType.BOOKING_CREATED:
      return <CalendarTodayOutlinedIcon className={`${cls} reminder`} />;
    case NotificationType.BOOKING_CONFIRMED:
      return <CheckCircleOutlineIcon className={`${cls} confirmed`} />;
    case NotificationType.BOOKING_CANCELLED:
    case NotificationType.BOOKING_REJECTED:
      return <CancelOutlinedIcon className={`${cls} cancelled`} />;
    case NotificationType.ORDER_CREATED:
    case NotificationType.ORDER_PAID:
      return <ShoppingBagOutlinedIcon className={`${cls} order-confirmed`} />;
    case NotificationType.ORDER_SHIPPED:
      return <LocalShippingOutlinedIcon className={`${cls} order-shipped`} />;
    case NotificationType.ORDER_DELIVERED:
      return <Inventory2OutlinedIcon className={`${cls} order-delivered`} />;
    case NotificationType.ORDER_CANCELLED:
      return (
        <RemoveShoppingCartOutlinedIcon className={`${cls} order-cancelled`} />
      );
    case NotificationType.REVIEW_REQUESTED:
      return <RateReviewOutlinedIcon className={`${cls} completed`} />;
    case NotificationType.PROMOTION:
      return <CampaignOutlinedIcon className={`${cls} reminder`} />;
    default:
      return <InfoOutlinedIcon className={`${cls} system-info`} />;
  }
}

// Relative time lives in libs/i18n/format so the community cards and these
// notifications share one implementation (and one set of plural rules).
export const timeAgo = (value: Date | string, locale = "en-US") => {
  const elapsed = Date.now() - new Date(value).getTime();
  if (elapsed >= 7 * 24 * 60 * 60 * 1000) return mediumDate(value, locale);
  return relativeTime(value, locale);
};

export const shortTimeAgo = timeAgo;
