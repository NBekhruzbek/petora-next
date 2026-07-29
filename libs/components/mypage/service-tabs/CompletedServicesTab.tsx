import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

const CompletedServicesTab = () => (
  <AgentBookingsList
    className="completed-services-tab"
    bookingStatus={BookingStatus.COMPLETED}
    chipLabel="Completed"
    chipClassName="completed"
    empty={{
      icon: <TaskAltOutlinedIcon />,
      title: "Nothing completed yet",
      description: "Appointments you mark complete are kept here.",
    }}
  />
);

export default CompletedServicesTab;
