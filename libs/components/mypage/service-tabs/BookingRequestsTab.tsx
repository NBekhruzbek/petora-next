import { useTranslation } from "react-i18next";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

interface Props {
  onBookingMoved?: (status: BookingStatus) => void;
}

const BookingRequestsTab = ({ onBookingMoved }: Props) => {
  const { t } = useTranslation();

  return (
    <AgentBookingsList
      onBookingMoved={onBookingMoved}
      className="booking-requests-tab"
      bookingStatus={BookingStatus.PENDING}
      chipLabel={t("mypage.tabs.pending")}
      chipClassName="pending"
      empty={{
        icon: <MarkEmailUnreadOutlinedIcon />,
        title: t("mypage.tabs.noRequests"),
        description: t("mypage.tabs.noRequestsDesc"),
      }}
      actions={[
        {
          label: t("mypage.tabs.accept"),
          nextStatus: BookingStatus.CONFIRMED,
          className: "request-accept-btn",
        },
        {
          label: t("mypage.tabs.reject"),
          nextStatus: BookingStatus.REJECTED,
          className: "request-reject-btn",
        },
      ]}
    />
  );
};

export default BookingRequestsTab;
