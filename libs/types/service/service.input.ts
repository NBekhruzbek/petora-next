import { Direction } from "@/libs/enums/common.enum";
import {
  ServiceLocation,
  ServiceStatus,
  ServiceType,
} from "@/libs/enums/service.enum";

export interface ServiceInput {
  serviceType: ServiceType;
  serviceTitle: string;
  serviceStatus?: ServiceStatus;
  serviceLocation: ServiceLocation;
  servicePrice: number;
  serviceImages: string[];
  serviceDurationMinutes: number;
  serviceDescription: string;
  memberId?: string;
}

interface ServicePriceRange {
  min?: number;
  max?: number;
}

interface SISearch {
  priceRange?: ServicePriceRange;
  onlyLiked: boolean;
  serviceType?: ServiceType[];
  serviceStatus?: ServiceStatus[];
  serviceLocation?: ServiceLocation[];
  text?: string;
}

export interface ServicesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: SISearch;
}

export interface ServiceOrdinaryInquiry {
  page: number;
  limit: number;
}
