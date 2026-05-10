import React, { useState } from "react";
import { Stack, Tab, Tabs, Box } from "@mui/material";
import MyServicesTab from "../mypage/service-tabs/MyServicesTab";
import BookingRequestsTab from "../mypage/service-tabs/BookingRequestsTab";
import UpcomingServicesTab from "../mypage/service-tabs/UpcomingServicesTab";
import CompletedServicesTab from "../mypage/service-tabs/CompletedServicesTab";

const ServiceManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = ["My Services", "Booking Requests", "Upcoming", "Completed"];

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
          {tabs.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>
      </Box>

      <Box className="service-mgmt-tab-content">
        {activeTab === 0 && <MyServicesTab />}
        {activeTab === 1 && <BookingRequestsTab />}
        {activeTab === 2 && <UpcomingServicesTab />}
        {activeTab === 3 && <CompletedServicesTab />}
      </Box>
    </Stack>
  );
};

export default ServiceManagement;
