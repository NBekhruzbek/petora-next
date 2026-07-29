import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_UNREAD_NOTIFICATIONS_COUNT } from "@/apollo/user/query";
import { BADGE_POLL_MS } from "@/libs/config";
import { useRefetchOnFocus } from "./useRefetchOnFocus";

interface UseUnreadNotificationsOptions {
  live?: boolean;
}

export const useUnreadNotifications = (
  options: UseUnreadNotificationsOptions = {},
) => {
  const { live = false } = options;
  const user = useReactiveVar(userVar);
  const authMember = Boolean(user?._id);

  const { data, refetch } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
    fetchPolicy: "cache-and-network",
    skip: !authMember,
    notifyOnNetworkStatusChange: true,
    ...(live ? { pollInterval: BADGE_POLL_MS } : {}),
  });

  useRefetchOnFocus(refetch, live && authMember);

  return {
    unreadCount: (data?.getUnreadNotificationsCount as number) ?? 0,
    refetchUnreadCount: refetch,
  };
};
