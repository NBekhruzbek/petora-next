import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

const UpcomingServicesTab = () => (
  <AgentBookingsList
    className="upcoming-services-tab"
    bookingStatus={BookingStatus.CONFIRMED}
    chipLabel="Upcoming"
    chipClassName="upcoming"
    empty={{
      icon: <EventAvailableOutlinedIcon />,
      title: "Nothing scheduled",
      description:
        "Requests you accept move here until the appointment is done.",
    }}
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
