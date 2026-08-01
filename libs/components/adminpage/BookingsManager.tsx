import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Drawer,
  IconButton,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PlaceIcon from "@mui/icons-material/Place";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ADMIN_DASHBOARD_STATS,
  GET_ALL_BOOKINGS_BY_ADMIN,
} from "@/apollo/admin/query";
import { UPDATE_BOOKING_BY_ADMIN } from "@/apollo/admin/mutation";
import { BookedInfo } from "@/libs/types/booking/booking";
import { BookingsInquiry } from "@/libs/types/booking/booking.input";
import { BookingStatus } from "@/libs/enums/booking.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  avatarUrl,
  formatDate,
  metaTotal,
  statusChipClass,
  useDebouncedValue,
  won,
} from "./adminHelpers";

const BOOKINGS_PER_PAGE = 10;

// Listed in the order a booking travels, so advancing one is a walk down the
// menu. CANCELLED is admin-only ground: the agent's own mutation refuses it.
const STATUS_OPTIONS: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.COMPLETED,
  BookingStatus.CANCELLED,
  BookingStatus.REJECTED,
];

/** An appointment is a moment, not a duration — date and time are one value. */
const appointmentAt = (booking: BookedInfo) => {
  const at = new Date(
    `${booking.bookingDate}T${booking.bookingTime || "00:00"}`,
  );
  return Number.isNaN(at.getTime()) ? null : at;
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/**
 * Orders are read by number; bookings are read by when. "Today" and "Tomorrow"
 * are what an admin actually scans for, so they replace the date rather than
 * decorate it.
 */
const whenLabel = (at: Date | null, locale: string) => {
  if (!at) return "—";
  const days = Math.round((startOfDay(at) - startOfDay(new Date())) / 86400000);
  // numeric:"auto" gives "today" / "tomorrow" / "yesterday" — and their Korean
  // equivalents — without hardcoding either language.
  if (Math.abs(days) <= 1)
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      days,
      "day",
    );
  return formatDate(at, locale);
};

const timeLabel = (booking: BookedInfo) => booking.bookingTime || "—";

/**
 * The failure this screen exists to surface: the appointment has been and gone
 * and the agent still never answered. Nothing else on the row says that.
 */
const isUnanswered = (booking: BookedInfo) => {
  if (booking.bookingStatus !== BookingStatus.PENDING) return false;
  const at = appointmentAt(booking);
  return Boolean(at && at.getTime() < Date.now());
};

const memberName = (member?: {
  memberFullName?: string;
  memberUserName: string;
}) => member?.memberFullName || member?.memberUserName || "—";

const BookingsManager = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | BookingStatus>(
    "ALL",
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  /** APOLLO REQUESTS **/

  const searchFilter: BookingsInquiry = {
    page,
    limit: BOOKINGS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    ...(filterStatus === "ALL" ? {} : { bookingStatus: filterStatus }),
    // Matched against bookingNumber server-side, so it searches every booking
    // and not just the page on screen.
    ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
  };

  const {
    data: bookingsData,
    previousData: bookingsPreviousData,
    refetch: bookingsRefetch,
  } = useQuery(GET_ALL_BOOKINGS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  // The awaiting-reply badge counts the whole collection, not just this page.
  const { data: statsData, refetch: statsRefetch } = useQuery(
    GET_ADMIN_DASHBOARD_STATS,
    { fetchPolicy: "cache-and-network" },
  );

  const [updateBookingByAdmin] = useMutation(UPDATE_BOOKING_BY_ADMIN);

  /** DERIVED **/

  const bookingsResult = bookingsData ?? bookingsPreviousData;
  const bookings: BookedInfo[] =
    bookingsResult?.getAllBookingsByAdmin?.list ?? [];
  const total = metaTotal(bookingsResult?.getAllBookingsByAdmin?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / BOOKINGS_PER_PAGE));
  const pendingCount = statsData?.getAdminDashboardStats?.pendingBookings ?? 0;

  // Read the selection back out of the list so the drawer follows a refetch
  // instead of showing the status the row had when it was opened.
  const selected = bookings.find((b) => b._id === selectedId) ?? null;

  /** HANDLERS **/

  const updateStatus = async (
    booking: BookedInfo,
    bookingStatus: BookingStatus,
  ) => {
    if (booking.bookingStatus === bookingStatus) return;
    try {
      await updateBookingByAdmin({
        variables: { input: { bookingId: booking._id, bookingStatus } },
      });
      await Promise.all([
        bookingsRefetch({ input: searchFilter }),
        statsRefetch(),
      ]);
      await sweetBottomSmallSuccessAlert("Booking updated!", 700);
    } catch (err: any) {
      console.log("ERROR, updateStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const openDetail = (booking: BookedInfo) => {
    setSelectedId(booking._id);
    setDrawerOpen(true);
  };

  const StatusSelect = ({ booking }: { booking: BookedInfo }) => (
    <Select
      value={booking.bookingStatus}
      onChange={(e) => updateStatus(booking, e.target.value as BookingStatus)}
      size="small"
      renderValue={(val) => (
        <span className={statusChipClass(val as string)}>
          {t(`admin.status.${val}`)}
        </span>
      )}
      className="admin-status-select"
    >
      {STATUS_OPTIONS.map((s) => (
        <MenuItem key={s} value={s}>
          <span className={statusChipClass(s)}>{t(`admin.status.${s}`)}</span>
        </MenuItem>
      ))}
    </Select>
  );

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.bookings.title")}
        </Typography>
        <Typography className="admin-ord-pending-count">
          {t("admin.awaitingReply", { count: pendingCount })}
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder={t("admin.bookings.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="admin-toolbar-search admin-bkg-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as "ALL" | BookingStatus);
              setPage(1);
            }}
            className="admin-toolbar-select admin-bkg-status-filter"
          >
            <MenuItem value="ALL">{t("admin.filter.allStatuses")}</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {t(`admin.status.${s}`)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {t("admin.showingOf", { shown: bookings.length, total })}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("admin.col.booking")}</TableCell>
                <TableCell>{t("admin.col.service")}</TableCell>
                <TableCell>{t("admin.col.customer")}</TableCell>
                <TableCell>{t("admin.col.agent")}</TableCell>
                <TableCell>{t("admin.col.when")}</TableCell>
                <TableCell>{t("admin.col.price")}</TableCell>
                <TableCell>{t("admin.col.status")}</TableCell>
                <TableCell>{t("admin.col.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => {
                const at = appointmentAt(booking);
                const unanswered = isUnanswered(booking);
                return (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-bkg-no">
                          {booking.bookingNumber}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap={0.4}
                          className="admin-bkg-pet"
                        >
                          <PetsIcon className="admin-icon-11-gray" />
                          <Typography className="admin-cell-meta">
                            {booking.bookingPetName} ·{" "}
                            {t(
                              `enums.productPetType.${booking.bookingPetType}`,
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-cell-name">
                          {booking.serviceData?.serviceTitle ?? "—"}
                        </Typography>
                        {booking.serviceData?.serviceLocation && (
                          <Typography className="admin-cell-meta">
                            {t(
                              `enums.serviceLocation.${booking.serviceData.serviceLocation}`,
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-cell-name">
                          {memberName(booking.userData)}
                        </Typography>
                        {booking.userData?.memberUserName && (
                          <Typography className="admin-agt-handle">
                            @{booking.userData.memberUserName}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-cell-name">
                          {memberName(booking.agentData)}
                        </Typography>
                        {booking.agentData?.memberUserName && (
                          <Typography className="admin-agt-handle">
                            @{booking.agentData.memberUserName}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    {/* The signature: when, not what, is how a booking is read */}
                    <TableCell>
                      <Stack className="admin-bkg-when">
                        <Typography
                          className={`admin-bkg-when-day${unanswered ? " unanswered" : ""}`}
                        >
                          {whenLabel(at, intlLocale)}
                        </Typography>
                        <Typography className="admin-bkg-when-time">
                          {timeLabel(booking)}
                        </Typography>
                        {unanswered && (
                          <Typography className="admin-bkg-unanswered">
                            Never answered
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-bkg-price">
                          {won(booking.bookingPrice)}
                        </Typography>
                        <span
                          className={`status-chip status-${booking.bookingPaymentStatus.toLowerCase()} admin-bkg-pay-chip`}
                        >
                          {t(`admin.status.${booking.bookingPaymentStatus}`)}
                        </span>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <StatusSelect booking={booking} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => openDetail(booking)}
                        className="admin-btn-edit"
                      >
                        {t("admin.act.details")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography className="admin-table-empty">
                      {t("admin.empty.bookings")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack className="admin-pagination">
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
      </Stack>

      {/* Booking Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ className: "admin-ord-drawer-paper" }}
        disablePortal
      >
        {selected && (
          <>
            {/* Sticky Header */}
            <Stack className="admin-ord-drawer-header">
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    className="admin-ord-header-icon-box"
                  >
                    <EventAvailableIcon className="admin-icon-20-indigo" />
                  </Stack>
                  <Stack>
                    <Typography className="admin-ord-header-title">
                      {selected.bookingNumber}
                    </Typography>
                    <Typography className="admin-ord-header-date">
                      Booked on {formatDate(selected.createdAt, intlLocale)}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  size="small"
                  className="admin-ord-close-btn"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            {/* Scrollable Body */}
            <Stack className="admin-ord-drawer-body">
              {/* The appointment leads, because that is what a booking is */}
              <Stack className="admin-bkg-when-card">
                <Typography className="admin-bkg-when-card-label">
                  Appointment
                </Typography>
                <Typography className="admin-bkg-when-card-day">
                  {whenLabel(appointmentAt(selected), intlLocale)}
                </Typography>
                <Typography className="admin-bkg-when-card-time">
                  {selected.bookingDate} · {timeLabel(selected)}
                </Typography>
                {isUnanswered(selected) && (
                  <Typography className="admin-bkg-when-card-flag">
                    This appointment passed without the agent ever replying.
                  </Typography>
                )}
              </Stack>

              {/* Status */}
              <Stack className="admin-ord-section-card">
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <EventAvailableIcon className="admin-icon-16-indigo" />
                  <Typography className="admin-ord-section-heading">
                    Booking Status
                  </Typography>
                </Stack>
                <StatusSelect booking={selected} />
              </Stack>

              {/* Pet */}
              <Stack className="admin-ord-section-card">
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <PetsIcon className="admin-icon-16-indigo" />
                  <Typography className="admin-ord-section-heading">
                    Pet
                  </Typography>
                </Stack>
                <Stack gap={1}>
                  {[
                    {
                      labelKey: "admin.bookings.name",
                      value: selected.bookingPetName,
                    },
                    {
                      labelKey: "admin.bookings.typeField",
                      value: t(
                        `enums.productPetType.${selected.bookingPetType}`,
                      ),
                    },
                    {
                      labelKey: "admin.bookings.age",
                      value: selected.bookingPetAge,
                    },
                    {
                      labelKey: "admin.bookings.note",
                      value: selected.bookingNote,
                    },
                  ].map(({ labelKey, value }) => (
                    <Stack
                      key={t(labelKey)}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Typography className="admin-cell-meta">
                        {t(labelKey)}
                      </Typography>
                      <Typography
                        className="admin-cell-name"
                        style={{ textAlign: "right" }}
                      >
                        {value || "—"}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {/* Service */}
              <Stack className="admin-ord-section-card">
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <PlaceIcon className="admin-icon-16-indigo" />
                  <Typography className="admin-ord-section-heading">
                    Service
                  </Typography>
                </Stack>
                <Stack gap={1}>
                  {[
                    {
                      labelKey: "admin.bookings.titleField",
                      value: selected.serviceData?.serviceTitle,
                    },
                    {
                      labelKey: "admin.bookings.typeField",
                      value: t(
                        `enums.serviceType.${selected.serviceData?.serviceType}`,
                      ),
                    },
                    {
                      labelKey: "admin.col.location",
                      value: t(
                        `enums.serviceLocation.${selected.serviceData?.serviceLocation}`,
                      ),
                    },
                    {
                      labelKey: "admin.bookings.address",
                      value: selected.bookingAddress,
                    },
                    {
                      labelKey: "admin.col.price",
                      value: won(selected.bookingPrice),
                    },
                    {
                      labelKey: "admin.bookings.payment",
                      value: t(`admin.status.${selected.bookingPaymentStatus}`),
                    },
                  ].map(({ labelKey, value }) => (
                    <Stack
                      key={t(labelKey)}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Typography className="admin-cell-meta">
                        {t(labelKey)}
                      </Typography>
                      <Typography
                        className="admin-cell-name"
                        style={{ textAlign: "right" }}
                      >
                        {value || "—"}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {/* Both sides of the appointment */}
              {[
                {
                  heading: "Customer",
                  icon: <PersonIcon className="admin-icon-16-indigo" />,
                  member: selected.userData,
                },
                {
                  heading: "Agent",
                  icon: <SupportAgentIcon className="admin-icon-16-indigo" />,
                  member: selected.agentData,
                },
              ].map(({ heading, icon, member }) => (
                <Stack key={heading} className="admin-ord-section-card">
                  <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                    {icon}
                    <Typography className="admin-ord-section-heading">
                      {heading}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <img
                      src={avatarUrl(member?.memberImage, memberName(member))}
                      alt=""
                      className="admin-drawer-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = avatarUrl(
                          undefined,
                          memberName(member),
                        );
                      }}
                    />
                    <Stack>
                      <Typography className="admin-ord-customer-name-text">
                        {memberName(member)}
                      </Typography>
                      <Typography className="admin-ord-customer-email-text">
                        {member?.memberEmail || member?.memberPhone || "—"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            {/* Sticky Footer */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              className="admin-ord-drawer-footer"
            >
              <Button
                onClick={() => setDrawerOpen(false)}
                className="admin-ord-close-footer-btn"
              >
                Close
              </Button>
            </Stack>
          </>
        )}
      </Drawer>
    </Stack>
  );
};

export default BookingsManager;
