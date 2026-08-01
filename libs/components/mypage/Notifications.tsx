import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
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
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
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
import { NotificationsInquiry } from "@/libs/types/notification/notification.input";
import {
  NotificationGroup,
  NotificationStatus,
} from "@/libs/enums/notification.enum";
import { Direction } from "@/libs/enums/common.enum";
import { sweetMixinErrorAlert } from "@/libs/sweetAlert";
import EmptyState from "../common/EmptyState";
import {
  DESTINATIONS,
  getNotificationIcon,
  groupLabelKey,
  timeAgo,
} from "../notifications/notificationPresentation";
import { useNotificationDestination } from "../notifications/useNotificationDestination";

const ITEMS_PER_PAGE = 8;

// Tab order maps onto NotificationGroup; "All" sends no group filter.
const TABS: { labelKey: string; group?: NotificationGroup }[] = [
  { labelKey: "mypage.notifications.all" },
  { labelKey: "mypage.notifications.orders", group: NotificationGroup.ORDERS },
  {
    labelKey: "mypage.notifications.bookings",
    group: NotificationGroup.BOOKINGS,
  },
  { labelKey: "mypage.notifications.system", group: NotificationGroup.SYSTEM },
];

const Notifications = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const { resolveDestination } = useNotificationDestination();
  const [activeTab, setActiveTab] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Notification | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const searchFilter: NotificationsInquiry = {
    page,
    limit: ITEMS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      ...(TABS[activeTab].group
        ? { notificationGroup: TABS[activeTab].group }
        : {}),
      ...(showUnreadOnly
        ? { notificationStatus: NotificationStatus.UNREAD }
        : {}),
    },
  };

  const {
    data: getNotificationsData,
    previousData: getNotificationsPreviousData,
    refetch: getNotificationsRefetch,
  } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    skip: !user?._id,
    notifyOnNetworkStatusChange: true,
  });

  // The sidebar and header badges are a separate query, so marking anything
  // read has to refresh them too — otherwise the count only settles on reload.
  const badgeRefetch = {
    refetchQueries: [{ query: GET_UNREAD_NOTIFICATIONS_COUNT }],
  };
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION, badgeRefetch);
  const [markAllNotificationsRead] = useMutation(
    MARK_ALL_NOTIFICATIONS_READ,
    badgeRefetch,
  );

  /** DERIVED **/

  // Keep the current page on screen while the next one loads — Apollo empties
  // `data` whenever the variables change, which would otherwise flash the empty
  // state between pages.
  const result = getNotificationsData ?? getNotificationsPreviousData;
  const items: Notification[] = result?.getNotifications?.list ?? [];
  const total: number = result?.getNotifications?.metaCounter?.[0]?.total ?? 0;
  const unreadCount: number =
    result?.getNotifications?.unreadCounter?.[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const selectedDestination = selected
    ? DESTINATIONS[selected.notificationType]
    : undefined;

  /** LIFECYCLES **/

  // Signing in as somebody else must not keep the previous member's inbox.
  useEffect(() => {
    setPage(1);
  }, [user?._id]);

  /** HANDLERS **/

  const handleTabChange = (_: React.SyntheticEvent, value: number) => {
    setActiveTab(value);
    setPage(1);
  };

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (!topRef.current) return;
    const scrollTarget =
      window.scrollY + topRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const handleToggleUnread = () => {
    setShowUnreadOnly((prev) => !prev);
    setPage(1);
  };

  const handleCardClick = async (notification: Notification) => {
    setSelected(notification);
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
      await getNotificationsRefetch({ input: searchFilter });
    } catch (err: any) {
      console.log("ERROR, handleCardClick:", err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      await getNotificationsRefetch({ input: searchFilter });
    } catch (err: any) {
      console.log("ERROR, handleMarkAllRead:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  // Resolved rather than looked up: a booking that has been accepted since the
  // notification was written now lives in a different Service Management tab.
  const handleAction = async (notification: Notification) => {
    setSelected(null);
    const href = await resolveDestination(notification);
    // scroll:false — MyPage brings the panel into view itself.
    if (href) void router.push(href, undefined, { scroll: false });
  };

  return (
    <Stack className="notifications-container" ref={topRef}>
      <Stack className="notifications-toolbar">
        <Stack direction="row" alignItems="center" gap="10px">
          <Typography className="notifications-count">
            {total} Notifications
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
            onClick={() => void handleMarkAllRead()}
          >
            {t("mypage.notifications.markAllRead")}
          </Button>
        )}
      </Stack>

      <Box className="notifications-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="notification tabs"
        >
          {TABS.map((tab) => (
            <Tab key={tab.labelKey} label={t(tab.labelKey)} />
          ))}
        </Tabs>
      </Box>

      <Stack className="notifications-list">
        {items.length === 0 ? (
          <EmptyState
            icon={<NotificationsOutlinedIcon />}
            title={
              showUnreadOnly
                ? t("mypage.notifications.caughtUp")
                : t("mypage.notifications.empty")
            }
            description={
              showUnreadOnly
                ? "Nothing unread. Clear the filter to see everything."
                : "Bookings and orders report back here as they progress."
            }
          />
        ) : (
          items.map((notification) => {
            const isRead =
              notification.notificationStatus === NotificationStatus.READ;

            return (
              <Stack
                key={notification._id}
                className={`notification-item ${isRead ? "read" : "unread"}`}
                direction="row"
                alignItems="flex-start"
                gap="14px"
                onClick={() => void handleCardClick(notification)}
              >
                <Stack className="notif-icon-wrap">
                  {getNotificationIcon(notification.notificationType)}
                </Stack>

                <Stack className="notif-body" flex={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="8px"
                  >
                    <Typography className="notif-title">
                      {notification.notificationTitle}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap="8px">
                      {!isRead && <span className="unread-dot" />}
                      <Typography className="notif-time">
                        {timeAgo(notification.createdAt, intlLocale)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography className="notif-message">
                    {notification.notificationContent}
                  </Typography>
                </Stack>
              </Stack>
            );
          })
        )}
      </Stack>

      {total > ITEMS_PER_PAGE && (
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
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        className="notif-dialog"
        PaperProps={{ className: "notif-dialog-paper" }}
      >
        {selected && (
          <>
            <Stack className="notif-dialog-header">
              <Chip
                label={t(groupLabelKey[selected.notificationGroup])}
                size="small"
                className="notif-dialog-chip"
              />
              <IconButton
                className="notif-dialog-close"
                onClick={() => setSelected(null)}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack className="notif-dialog-body">
              <Stack direction="row" alignItems="flex-start" gap="14px">
                <Stack className="notif-dialog-icon-wrap">
                  {getNotificationIcon(selected.notificationType, true)}
                </Stack>
                <Stack gap="4px">
                  <Typography className="notif-dialog-title">
                    {selected.notificationTitle}
                  </Typography>
                  <Typography className="notif-dialog-time">
                    {timeAgo(selected.createdAt, intlLocale)}
                  </Typography>
                </Stack>
              </Stack>
              <Typography className="notif-dialog-message">
                {selected.notificationContent}
              </Typography>
              {selectedDestination && selected.notificationRefId && (
                <Button
                  className="notif-dialog-action"
                  onClick={() => void handleAction(selected)}
                >
                  {t(selectedDestination.labelKey)}
                </Button>
              )}
            </Stack>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

export default Notifications;
