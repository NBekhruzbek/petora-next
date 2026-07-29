import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_AGENT_BOOKINGS } from "@/apollo/user/query";
import { BADGE_POLL_MS } from "@/libs/config";
import { BookingStatus } from "@/libs/enums/booking.enum";
import { MemberType } from "@/libs/enums/member.enum";
import { useRefetchOnFocus } from "./useRefetchOnFocus";

interface UsePendingBookingRequestsOptions {
  live?: boolean;
}

export const usePendingBookingRequests = (
  options: UsePendingBookingRequestsOptions = {},
) => {
  const { live = false } = options;
  const user = useReactiveVar(userVar);
  const isAgent = user?.memberType === MemberType.AGENT;

  const { data, refetch } = useQuery(GET_AGENT_BOOKINGS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: { page: 1, limit: 1, bookingStatus: BookingStatus.PENDING },
    },
    skip: !isAgent,
    notifyOnNetworkStatusChange: true,
    ...(live ? { pollInterval: BADGE_POLL_MS } : {}),
  });

  useRefetchOnFocus(refetch, live && isAgent);

  return {
    pendingCount:
      (data?.getAgentBookings?.metaCounter?.[0]?.total as number) ?? 0,
    refetchPendingCount: refetch,
  };
};
