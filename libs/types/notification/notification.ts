import {
  NotificationGroup,
  NotificationStatus,
  NotificationType,
} from "@/libs/enums/notification.enum";
import { TotalCounter } from "../member/member";

export interface Notification {
  _id: string;
  notificationType: NotificationType;
  notificationStatus: NotificationStatus;
  notificationGroup: NotificationGroup;
  notificationTitle: string;
  notificationContent?: string;
  notificationRefId?: string;
  authorId?: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notifications {
  list: Notification[];
  metaCounter?: TotalCounter[];
  unreadCounter?: TotalCounter[];
}
