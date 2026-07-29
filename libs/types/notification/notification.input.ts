import {
  NotificationGroup,
  NotificationStatus,
} from "@/libs/enums/notification.enum";
import { Direction } from "@/libs/enums/common.enum";

interface NISearch {
  notificationGroup?: NotificationGroup;
  notificationStatus?: NotificationStatus;
}

export interface NotificationsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search?: NISearch;
}

export interface NotificationUpdate {
  notificationId: string;
  notificationStatus: NotificationStatus;
}
