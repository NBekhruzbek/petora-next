import { BookingStatus } from "@/libs/enums/booking.enum";

export interface BookingUpdateInput {
  bookingId: string;
  bookingStatus: BookingStatus;
}
