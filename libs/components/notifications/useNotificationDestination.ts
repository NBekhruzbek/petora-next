import { useApolloClient } from "@apollo/client";
import { GET_AGENT_BOOKINGS } from "@/apollo/user/query";
import { Notification } from "@/libs/types/notification/notification";
import { BookedInfo } from "@/libs/types/booking/booking";
import { Direction } from "@/libs/enums/common.enum";
import { SERVICE_TAB_FOR_BOOKING_STATUS } from "../mypage/ServiceManagement";
import { BOOKING_REQUESTS, DESTINATIONS } from "./notificationPresentation";

const LOOKUP_LIMIT = 100;

const SERVICE_MANAGEMENT = "/mypage?articleCategory=SERVICE_MANAGEMENT&tab=";

export const useNotificationDestination = () => {
  const client = useApolloClient();

  const resolve = async (
    notification: Notification,
  ): Promise<string | null> => {
    const destination = DESTINATIONS[notification.notificationType];
    if (!destination) return null;
    if (
      destination.href !== BOOKING_REQUESTS ||
      !notification.notificationRefId
    ) {
      return destination.href;
    }

    try {
      const { data } = await client.query({
        query: GET_AGENT_BOOKINGS,
        variables: {
          input: {
            page: 1,
            limit: LOOKUP_LIMIT,
            sort: "createdAt",
            direction: Direction.DESC,
          },
        },
        fetchPolicy: "network-only",
      });

      const bookings: BookedInfo[] = data?.getAgentBookings?.list ?? [];
      const booking = bookings.find(
        (item) => item._id === notification.notificationRefId,
      );

      if (!booking) return destination.href;
      const tab = SERVICE_TAB_FOR_BOOKING_STATUS[booking.bookingStatus];
      return tab ? `${SERVICE_MANAGEMENT}${tab}` : destination.href;
    } catch (err: any) {
      console.log("ERROR, useNotificationDestination:", err.message);
      return destination.href;
    }
  };

  return { resolveDestination: resolve };
};
