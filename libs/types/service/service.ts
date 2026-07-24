import {
  ServiceLocation,
  ServiceStatus,
  ServiceType,
} from "@/libs/enums/service.enum";
import { MeLiked } from "../like/like";

export interface Service {
  _id: string;
  serviceType: ServiceType;
  serviceTitle: string;
  serviceStatus: ServiceStatus;
  serviceLocation: ServiceLocation;
  servicePrice: number;
  serviceImages: string[];
  serviceDurationMinutes: number;
  serviceDescription: string;
  serviceBookings: number;
  serviceLikes: number;
  serviceViews: number;
  serviceReviews: number;
  serviceRating: number;
  serviceRank: number;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation */
  meLiked?: MeLiked[];
}

export interface ServiceTotalCounter {
  total: number;
}

export interface Services {
  list: Service[];
  metaCounter: ServiceTotalCounter[];
}
