import { MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import {
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS_COUNT,
} from "@/apollo/user/query";
import {
  MARK_ALL_NOTIFICATIONS_READ,
  UPDATE_NOTIFICATION,
} from "@/apollo/user/mutation";
import { Notification } from "@/libs/types/notification/notification";
import { NotificationStatus } from "@/libs/enums/notification.enum";
import { Direction } from "@/libs/enums/common.enum";
import { useUnreadNotifications } from "@/libs/hooks/useUnreadNotifications";
import EmptyState from "../common/EmptyState";
import {
  ALL_NOTIFICATIONS,
  getNotificationIcon,
  shortTimeAgo,
} from "./notificationPresentation";
import { useNotificationDestination } from "./useNotificationDestination";

const PREVIEW_LIMIT = 6;

const NotificationBell = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const { resolveDestination } = useNotificationDestination();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  const [ringing, setRinging] = useState(false);
  const lastCount = useRef<number | null>(null);

  /** APOLLO REQUESTS **/

  const { unreadCount } = useUnreadNotifications({ live: true });

  const searchFilter = {
    page: 1,
    limit: PREVIEW_LIMIT,
    sort: "createdAt",
    direction: Direction.DESC,
  };

  const { data: getNotificationsData, refetch: getNotificationsRefetch } =
    useQuery(GET_NOTIFICATIONS, {
      fetchPolicy: "cache-and-network",
      variables: { input: searchFilter },
      skip: !user?._id || !open,
      notifyOnNetworkStatusChange: true,
    });

  const badgeRefetch = {
    refetchQueries: [{ query: GET_UNREAD_NOTIFICATIONS_COUNT }],
  };
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION, badgeRefetch);
  const [markAllNotificationsRead] = useMutation(
    MARK_ALL_NOTIFICATIONS_READ,
    badgeRefetch,
  );

  /** DERIVED **/

  const items: Notification[] =
    getNotificationsData?.getNotifications?.list ?? [];

  /** LIFECYCLES **/

  useEffect(() => {
    if (lastCount.current === null) {
      lastCount.current = unreadCount;
      return;
    }
    if (unreadCount > lastCount.current) {
      setRinging(true);
      const timer = setTimeout(() => setRinging(false), 900);
      lastCount.current = unreadCount;
      return () => clearTimeout(timer);
    }
    lastCount.current = unreadCount;
  }, [unreadCount]);

  /** HANDLERS **/

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchor(event.currentTarget);
  const handleClose = () => setAnchor(null);

  const handleItemClick = async (notification: Notification) => {
    handleClose();

    const href = await resolveDestination(notification);
    if (href) void router.push(href, undefined, { scroll: false });

    if (notification.notificationStatus === NotificationStatus.READ) return;
    try {
      await updateNotification({
        variables: {
          input: {
            notificationId: notification._id,
            notificationStatus: NotificationStatus.READ,
          },
        },
      });
    } catch (err: any) {
      console.log("ERROR, handleItemClick:", err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      await getNotificationsRefetch({ input: searchFilter });
    } catch (err: any) {
      console.log("ERROR, handleMarkAllRead:", err.message);
    }
  };

  const handleSeeAll = () => {
    handleClose();
    void router.push(ALL_NOTIFICATIONS, undefined, { scroll: false });
  };

  if (!user?._id) return null;

  return (
    <Box className="notif-bell-wrap">
      <IconButton
        className={`notif-bell-btn ${ringing ? "ringing" : ""}`}
        onClick={handleOpen}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {/* Default (rectangular) anchoring, same as the basket badge beside it,
            so the two sit at the same height. */}
        <Badge badgeContent={unreadCount} max={99} className="notif-bell-badge">
          <NotificationsNoneRoundedIcon className="notif-bell-icon" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        disableScrollLock
        sx={{ mt: "10px", zIndex: 12000 }}
        PaperProps={{ className: "notif-menu-paper", elevation: 0 }}
        MenuListProps={{ sx: { p: 0 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box className="notif-menu-frame">
          <Stack className="notif-menu-header">
            <Stack className="notif-menu-heading">
              <Typography className="notif-menu-title">
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Typography className="notif-menu-count">
                  {unreadCount} unread
                </Typography>
              )}
            </Stack>
            {unreadCount > 0 && (
              <Button
                className="notif-menu-markall"
                startIcon={<DoneAllIcon />}
                onClick={() => void handleMarkAllRead()}
              >
                Mark all read
              </Button>
            )}
          </Stack>

          <Stack className="notif-menu-list">
            {items.length === 0 ? (
              <EmptyState
                icon={<NotificationsNoneRoundedIcon />}
                title="You're all caught up"
                description="Bookings and orders report back here."
              />
            ) : (
              items.map((notification) => {
                const isRead =
                  notification.notificationStatus === NotificationStatus.READ;

                return (
                  <Box
                    key={notification._id}
                    component="button"
                    type="button"
                    className={`notif-menu-item ${isRead ? "read" : "unread"}`}
                    onClick={() => void handleItemClick(notification)}
                  >
                    <Stack className="notif-menu-item-icon">
                      {getNotificationIcon(notification.notificationType)}
                    </Stack>
                    <Stack className="notif-menu-item-body">
                      <Stack className="notif-menu-item-top">
                        <Typography className="notif-menu-item-title">
                          {notification.notificationTitle}
                        </Typography>
                        <Typography className="notif-menu-item-time">
                          {shortTimeAgo(notification.createdAt)}
                        </Typography>
                      </Stack>
                      <Typography className="notif-menu-item-text">
                        {notification.notificationContent}
                      </Typography>
                    </Stack>
                  </Box>
                );
              })
            )}
          </Stack>

          <Box className="notif-menu-footer">
            <Button className="notif-menu-seeall" onClick={handleSeeAll}>
              See all notifications
            </Button>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default NotificationBell;
