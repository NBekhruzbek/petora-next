import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

interface Props {
  onBookingMoved?: (status: BookingStatus) => void;
}

const BookingRequestsTab = ({ onBookingMoved }: Props) => (
  <AgentBookingsList
    onBookingMoved={onBookingMoved}
    className="booking-requests-tab"
    bookingStatus={BookingStatus.PENDING}
    chipLabel="Pending"
    chipClassName="pending"
    empty={{
      icon: <MarkEmailUnreadOutlinedIcon />,
      title: "No requests waiting",
      description:
        "New booking requests arrive here for you to accept or decline.",
    }}
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
