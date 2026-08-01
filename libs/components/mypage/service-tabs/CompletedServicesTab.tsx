import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { useTranslation } from "react-i18next";
import AgentBookingsList from "./AgentBookingsList";
import { BookingStatus } from "@/libs/enums/booking.enum";

const CompletedServicesTab = () => {
  const { t } = useTranslation();

  return (
    <AgentBookingsList
      className="completed-services-tab"
      bookingStatus={BookingStatus.COMPLETED}
      chipLabel={t("mypage.tabs.completedChip")}
      chipClassName="completed"
      empty={{
        icon: <TaskAltOutlinedIcon />,
        title: t("mypage.tabs.nothingCompleted"),
        description: t("mypage.tabs.nothingCompletedDesc"),
      }}
    />
  );
};

export default CompletedServicesTab;
