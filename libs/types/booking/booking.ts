import {
  BookingPaymentStatus,
  BookingPetType,
  BookingStatus,
} from "@/libs/enums/booking.enum";
import { Service } from "../service/service";
import { Member } from "../member/member";

export interface BookedInfo {
  _id: string;
  bookingNumber: string;
  bookingStatus: BookingStatus;
  bookingPaymentStatus: BookingPaymentStatus;
  bookingDate: string;
  bookingTime: string;
  bookingPrice: number;
  bookingPetType: BookingPetType;
  bookingPetName: string;
  bookingPetAge?: string;
  bookingNote?: string;
  bookingAddress?: string;
  serviceId: string;
  serviceData?: Service;
  userId: string;
  agentId: string;
  /** from aggregation — only getAllBookingsByAdmin joins the two members. */
  userData?: Member;
  agentData?: Member;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingTotalCounter {
  total: number;
}

export interface Bookings {
  list: BookedInfo[];
  metaCounter?: BookingTotalCounter[];
}
