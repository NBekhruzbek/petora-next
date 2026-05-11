import React, { useState } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";

const UPCOMING = [
  {
    id: 1,
    service: "Premium Grooming",
    date: "May 12, 2026 · 10:00 AM",
    request: "Sensitive skin, use gentle shampoo.",
    status: "upcoming",
  },
  {
    id: 2,
    service: "Dog Walking",
    date: "May 12, 2026 · 2:00 PM",
    request: "Needs extra exercise, energetic dog.",
    status: "upcoming",
  },
  {
    id: 3,
    service: "Cat Boarding",
    date: "May 13-15, 2026",
    request: "Special diet required, medication at 8pm.",
    status: "upcoming",
  },
  {
    id: 4,
    service: "Health Checkup",
    date: "May 14, 2026 · 11:00 AM",
    request: "Annual vaccination due.",
    status: "upcoming",
  },
];

const UpcomingServicesTab = () => {
  const [serviceStatuses, setServiceStatuses] = useState<
    Record<number, string>
  >({});

  const getServiceStatus = (service: (typeof UPCOMING)[number]) => {
    return serviceStatuses[service.id] || service.status;
  };

  const completeService = (serviceId: number) => {
    setServiceStatuses((prev) => ({ ...prev, [serviceId]: "completed" }));
  };

  return (
    <Stack spacing={1.5} className="upcoming-services-tab">
      <Stack spacing={1.5} className="requests-list">
        {UPCOMING.map((item) => {
          const status = getServiceStatus(item);

          return (
            <Stack
              key={item.id}
              className="request-row"
              direction="row"
              alignItems="center"
            >
              <Stack className="request-main" spacing={0.5}>
                <Typography className="request-label">Service Name</Typography>
                <Typography className="request-service">
                  {item.service}
                </Typography>
              </Stack>

              <Stack className="request-date-block" spacing={0.5}>
                <Typography className="request-label">Date</Typography>
                <Typography className="request-date">{item.date}</Typography>
              </Stack>

              <Stack className="request-note-block" spacing={0.5}>
                <Typography className="request-label">
                  Customer Request
                </Typography>
                <Typography className="request-note">
                  {item.request || "No additional request"}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                className="request-status-actions"
              >
                <Chip
                  label={status === "completed" ? "Completed" : "Upcoming"}
                  size="small"
                  className={`request-status-chip ${status}`}
                />
                {status !== "completed" && (
                  <Button
                    className="request-complete-btn"
                    onClick={() => completeService(item.id)}
                  >
                    Completed
                  </Button>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default UpcomingServicesTab;
