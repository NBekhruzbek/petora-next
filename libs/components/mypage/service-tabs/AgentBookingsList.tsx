import { ReactNode } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_AGENT_BOOKINGS } from "@/apollo/user/query";
import { UPDATE_BOOKING_BY_AGENT } from "@/apollo/user/mutation";
import { BookedInfo } from "@/libs/types/booking/booking";
import EmptyState from "../../common/EmptyState";
import { BookingStatus } from "@/libs/enums/booking.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

const BOOKINGS_LIMIT = 50;

export interface BookingRowAction {
  label: string;
  nextStatus: BookingStatus;
  className: string;
}

interface AgentBookingsListProps {
  className: string;
  bookingStatus: BookingStatus;
  chipLabel: string;
  chipClassName: string;
  empty: { icon: ReactNode; title: string; description: string };
  actions?: BookingRowAction[];
  onBookingMoved?: (status: BookingStatus) => void;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// bookingDate is stored as YYYY-MM-DD and bookingTime as HH:mm.
export const formatBookingMoment = (date?: string, time?: string) => {
  if (!date) return "—";
  const [year, month, day] = date.split("-");
  const label = `${MONTHS[Number(month) - 1] ?? month} ${Number(day)}, ${year}`;
  if (!time) return label;

  const [rawHour, minute] = time.split(":");
  const hour = Number(rawHour);
  const suffix = hour >= 12 ? "PM" : "AM";
  const clock = hour % 12 === 0 ? 12 : hour % 12;
  return `${label} · ${clock}:${minute} ${suffix}`;
};

const AgentBookingsList = ({
  className,
  bookingStatus,
  chipLabel,
  chipClassName,
  empty,
  actions = [],
  onBookingMoved,
}: AgentBookingsListProps) => {
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/

  const searchFilter = {
    page: 1,
    limit: BOOKINGS_LIMIT,
    sort: "createdAt",
    direction: Direction.DESC,
    bookingStatus,
  };

  const {
    data: getAgentBookingsData,
    previousData: getAgentBookingsPreviousData,
    loading: getAgentBookingsLoading,
  } = useQuery(GET_AGENT_BOOKINGS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    skip: !user?._id,
    notifyOnNetworkStatusChange: true,
  });

  // The tab's list and MyPage's pending-requests badge are the same query with
  // different variables, so they are separate cache entries. Refetching by
  // operation name moves both; refetching this list alone would leave the badge
  // stale until a reload.
  const [updateBookingByAgent] = useMutation(UPDATE_BOOKING_BY_AGENT, {
    refetchQueries: ["GetAgentBookings"],
    awaitRefetchQueries: true,
  });

  /** DERIVED **/

  const result = getAgentBookingsData ?? getAgentBookingsPreviousData;
  const bookings: BookedInfo[] = result?.getAgentBookings?.list ?? [];
  // Landing on a tab straight after accepting must not flash "nothing here"
  // before the row arrives — that is a loading state, not an empty one.
  const isLoading = getAgentBookingsLoading && !result;

  /** HANDLERS **/

  const handleAction = async (
    booking: BookedInfo,
    nextStatus: BookingStatus,
  ) => {
    try {
      await updateBookingByAgent({
        variables: {
          input: { bookingId: booking._id, bookingStatus: nextStatus },
        },
      });
      // The row leaves this tab and shows up in the one for its new status;
      // refetchQueries above has already reloaded both it and the badge.
      await sweetBottomSmallSuccessAlert("Booking updated!", 700);
      onBookingMoved?.(nextStatus);
    } catch (err: any) {
      console.log("ERROR, handleAction:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  return (
    <Stack spacing={1.5} className={className}>
      <Stack spacing={1.5} className="requests-list">
        {bookings.length === 0 && !isLoading && (
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            description={empty.description}
          />
        )}

        {bookings.map((booking) => (
          <Stack
            key={booking._id}
            className="request-row"
            direction="row"
            alignItems="center"
          >
            <Stack className="request-main" spacing={0.5}>
              <Typography className="request-label">Service Name</Typography>
              <Typography className="request-service">
                {booking.serviceData?.serviceTitle ?? "Service removed"}
              </Typography>
              <Typography className="request-note">
                {booking.bookingPetName} · {booking.bookingPetType}
              </Typography>
            </Stack>

            <Stack className="request-date-block" spacing={0.5}>
              <Typography className="request-label">Date</Typography>
              <Typography className="request-date">
                {formatBookingMoment(booking.bookingDate, booking.bookingTime)}
              </Typography>
            </Stack>

            <Stack className="request-note-block" spacing={0.5}>
              <Typography className="request-label">
                Customer Request
              </Typography>
              <Typography className="request-note">
                {booking.bookingNote || "No additional request"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              className="request-status-actions"
            >
              <Chip
                label={chipLabel}
                size="small"
                className={`request-status-chip ${chipClassName}`}
              />
              {actions.map((action) => (
                <Button
                  key={action.nextStatus}
                  className={action.className}
                  onClick={() => void handleAction(booking, action.nextStatus)}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default AgentBookingsList;
