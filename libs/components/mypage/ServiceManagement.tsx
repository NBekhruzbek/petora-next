import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { Stack, Tab, Tabs, Box } from "@mui/material";
import { useRouter } from "next/router";
import { BookingStatus } from "@/libs/enums/booking.enum";
import MyServicesTab from "../mypage/service-tabs/MyServicesTab";
import BookingRequestsTab from "../mypage/service-tabs/BookingRequestsTab";
import UpcomingServicesTab from "../mypage/service-tabs/UpcomingServicesTab";
import CompletedServicesTab from "../mypage/service-tabs/CompletedServicesTab";

// One source of truth for the tab order, the labels and the ?tab= deep link, so
// reordering the tabs can never silently change which panel a link opens.
const TABS = [
  { key: "SERVICES", labelKey: "mypage.serviceMgmt.myServices" },
  { key: "REQUESTS", labelKey: "mypage.serviceMgmt.requests" },
  { key: "UPCOMING", labelKey: "mypage.serviceMgmt.upcoming" },
  { key: "COMPLETED", labelKey: "mypage.serviceMgmt.completed" },
] as const;

const DEFAULT_TAB_KEY = "REQUESTS";

export type ServiceTabKey = (typeof TABS)[number]["key"];
export const SERVICE_TAB_FOR_BOOKING_STATUS: Partial<
  Record<BookingStatus, ServiceTabKey>
> = {
  [BookingStatus.PENDING]: "REQUESTS",
  [BookingStatus.CONFIRMED]: "UPCOMING",
  [BookingStatus.COMPLETED]: "COMPLETED",
};

const ServiceManagement = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const requestedTab = TABS.findIndex((tab) => tab.key === router.query.tab);
  const initialTab =
    requestedTab >= 0
      ? requestedTab
      : Math.max(
          0,
          TABS.findIndex((tab) => tab.key === DEFAULT_TAB_KEY),
        );
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const activeTabKey = TABS[activeTab]?.key ?? TABS[0].key;

  const handleBookingMoved = (status: BookingStatus) => {
    const key = SERVICE_TAB_FOR_BOOKING_STATUS[status];
    if (!key) return;
    const index = TABS.findIndex((tab) => tab.key === key);
    if (index >= 0) setActiveTab(index);
  };

  return (
    <Stack className="service-mgmt-container" spacing={3}>
      <Box className="service-mgmt-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="service management tabs"
        >
          {TABS.map((tab) => (
            <Tab key={tab.key} label={t(tab.labelKey)} />
          ))}
        </Tabs>
      </Box>

      <Box className="service-mgmt-tab-content">
        {activeTabKey === "SERVICES" && <MyServicesTab />}
        {activeTabKey === "REQUESTS" && (
          <BookingRequestsTab onBookingMoved={handleBookingMoved} />
        )}
        {activeTabKey === "UPCOMING" && (
          <UpcomingServicesTab onBookingMoved={handleBookingMoved} />
        )}
        {activeTabKey === "COMPLETED" && <CompletedServicesTab />}
      </Box>
    </Stack>
  );
};

export default ServiceManagement;
