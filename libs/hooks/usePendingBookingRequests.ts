import { useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { socketVar, userVar } from "@/apollo/store";
import { GET_AGENT_BOOKINGS } from "@/apollo/user/query";
import { BookingStatus } from "@/libs/enums/booking.enum";
import { MemberType } from "@/libs/enums/member.enum";
import { NotificationGroup } from "@/libs/enums/notification.enum";
import { useRefetchOnFocus } from "./useRefetchOnFocus";

interface UsePendingBookingRequestsOptions {
  live?: boolean;
}

export const usePendingBookingRequests = (
  options: UsePendingBookingRequestsOptions = {},
) => {
  const { live = false } = options;
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);
  const isAgent = user?.memberType === MemberType.AGENT;

  const { data, refetch } = useQuery(GET_AGENT_BOOKINGS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: { page: 1, limit: 1, bookingStatus: BookingStatus.PENDING },
    },
    skip: !isAgent,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!live || !isAgent || !socket) return;

    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      if (
        data.event === "notification" &&
        data.notification?.notificationGroup === NotificationGroup.BOOKINGS
      ) {
        refetch();
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket, live, isAgent, refetch]);

  useRefetchOnFocus(refetch, live && isAgent);

  return {
    pendingCount:
      (data?.getAgentBookings?.metaCounter?.[0]?.total as number) ?? 0,
    refetchPendingCount: refetch,
  };
};
