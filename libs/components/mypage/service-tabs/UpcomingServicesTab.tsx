import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

const UpcomingServicesTab = () => (
  <AgentBookingsList
    className="upcoming-services-tab"
    bookingStatus={BookingStatus.CONFIRMED}
    chipLabel="Upcoming"
    chipClassName="upcoming"
    emptyText="No upcoming services."
    actions={[
      {
        label: "Complete",
        nextStatus: BookingStatus.COMPLETED,
        className: "request-complete-btn",
      },
    ]}
  />
);

export default UpcomingServicesTab;
