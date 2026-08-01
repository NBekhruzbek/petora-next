import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { useTranslation } from "react-i18next";
import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

interface Props {
  onBookingMoved?: (status: BookingStatus) => void;
}

const UpcomingServicesTab = ({ onBookingMoved }: Props) => {
  const { t } = useTranslation();

  return (
    <AgentBookingsList
      onBookingMoved={onBookingMoved}
      className="upcoming-services-tab"
      bookingStatus={BookingStatus.CONFIRMED}
      chipLabel={t("mypage.tabs.upcomingChip")}
      chipClassName="upcoming"
      empty={{
        icon: <EventAvailableOutlinedIcon />,
        title: t("mypage.tabs.nothingScheduled"),
        description: t("mypage.tabs.nothingScheduledDesc"),
      }}
      actions={[
        {
          label: t("mypage.tabs.complete"),
          nextStatus: BookingStatus.COMPLETED,
          className: "request-complete-btn",
        },
      ]}
    />
  );
};

export default UpcomingServicesTab;
