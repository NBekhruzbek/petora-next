import React, { useState } from "react";
import { Stack, Tab, Tabs, Box } from "@mui/material";
import { useRouter } from "next/router";
import MyServicesTab from "../mypage/service-tabs/MyServicesTab";
import BookingRequestsTab from "../mypage/service-tabs/BookingRequestsTab";
import UpcomingServicesTab from "../mypage/service-tabs/UpcomingServicesTab";
import CompletedServicesTab from "../mypage/service-tabs/CompletedServicesTab";

// One source of truth for the tab order, the labels and the ?tab= deep link, so
// reordering the tabs can never silently change which panel a link opens.
const TABS = [
  { key: "SERVICES", label: "My Services" },
  { key: "REQUESTS", label: "Booking Requests" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "COMPLETED", label: "Completed" },
] as const;

// Booking Requests is what the sidebar badge counts and the only tab with work
// waiting on the agent, so it opens first — My Services keeps its place in the
// strip, it just isn't the landing tab.
const DEFAULT_TAB_KEY = "REQUESTS";

const ServiceManagement = () => {
  const router = useRouter();
  // An explicit ?tab= wins; anything missing or unknown lands on the default.
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
            <Tab key={tab.key} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Box className="service-mgmt-tab-content">
        {activeTabKey === "SERVICES" && <MyServicesTab />}
        {activeTabKey === "REQUESTS" && <BookingRequestsTab />}
        {activeTabKey === "UPCOMING" && <UpcomingServicesTab />}
        {activeTabKey === "COMPLETED" && <CompletedServicesTab />}
      </Box>
    </Stack>
  );
};

export default ServiceManagement;
