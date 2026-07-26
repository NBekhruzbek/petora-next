import { BookingPetType, BookingStatus } from "@/libs/enums/booking.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface BookingInput {
  bookingDate: string;
  bookingTime: string;
  bookingPetType: BookingPetType;
  bookingPetName: string;
  bookingPetAge?: string;
  bookingNote?: string;
  bookingAddress?: string;
  serviceId: string;
}

export interface BookingsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  bookingStatus?: BookingStatus;
  text?: string;
}
