import {
  ServiceLocation,
  ServiceStatus,
  ServiceType,
} from "@/libs/enums/service.enum";

export interface ServiceUpdate {
  serviceId: string;
  serviceType?: ServiceType;
  serviceTitle?: string;
  serviceStatus?: ServiceStatus;
  serviceLocation?: ServiceLocation;
  servicePrice?: number;
  serviceImages?: string[];
  serviceDurationMinutes?: number;
  serviceDescription?: string;
  deletedAt?: Date;
}
