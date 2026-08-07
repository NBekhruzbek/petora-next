import { useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { socketVar, userVar } from "@/apollo/store";
import { GET_UNREAD_NOTIFICATIONS_COUNT } from "@/apollo/user/query";
import { useRefetchOnFocus } from "./useRefetchOnFocus";

interface UseUnreadNotificationsOptions {
  live?: boolean;
}

export const useUnreadNotifications = (
  options: UseUnreadNotificationsOptions = {},
) => {
  const { live = false } = options;
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);
  const authMember = Boolean(user?._id);

  const { data, refetch } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
    fetchPolicy: "cache-and-network",
    skip: !authMember,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!live || !authMember || !socket) return;

    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      if (data.event === "notification") refetch();
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket, live, authMember, refetch]);

  useRefetchOnFocus(refetch, live && authMember);

  return {
    unreadCount: (data?.getUnreadNotificationsCount as number) ?? 0,
    refetchUnreadCount: refetch,
  };
};
