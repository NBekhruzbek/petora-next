import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

const BookingRequestsTab = () => (
  <AgentBookingsList
    className="booking-requests-tab"
    bookingStatus={BookingStatus.PENDING}
    chipLabel="Pending"
    chipClassName="pending"
    emptyText="No booking requests waiting on you."
    actions={[
      {
        label: "Accept",
        nextStatus: BookingStatus.CONFIRMED,
        className: "request-accept-btn",
      },
      {
        label: "Reject",
        nextStatus: BookingStatus.REJECTED,
        className: "request-reject-btn",
      },
    ]}
  />
);

export default BookingRequestsTab;
