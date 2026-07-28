import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

const CompletedServicesTab = () => (
  <AgentBookingsList
    className="completed-services-tab"
    bookingStatus={BookingStatus.COMPLETED}
    chipLabel="Completed"
    chipClassName="completed"
    emptyText="No completed services yet."
  />
);

export default CompletedServicesTab;
