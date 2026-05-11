import React from "react";
import { Chip, Stack, Typography } from "@mui/material";

const COMPLETED = [
  {
    id: 1,
    service: "Premium Grooming",
    date: "May 10, 2026",
    request: "Sensitive skin, use gentle shampoo.",
    status: "completed",
  },
  {
    id: 2,
    service: "Dog Walking",
    date: "May 9, 2026",
    request: "Needs extra exercise, energetic dog.",
    status: "completed",
  },
  {
    id: 3,
    service: "Cat Boarding",
    date: "May 8-9, 2026",
    request: "Special diet required, medication at 8pm.",
    status: "completed",
  },
  {
    id: 4,
    service: "Health Checkup",
    date: "May 7, 2026",
    request: "Annual vaccination due.",
    status: "completed",
  },
  {
    id: 5,
    service: "Premium Grooming",
    date: "May 6, 2026",
    request: "",
    status: "completed",
  },
];

const CompletedServicesTab = () => {
  return (
    <Stack spacing={1.5} className="completed-services-tab">
      <Stack spacing={1.5} className="requests-list">
        {COMPLETED.map((item) => (
          <Stack
            key={item.id}
            className="request-row"
            direction="row"
            alignItems="center"
          >
            <Stack className="request-main" spacing={0.5}>
              <Typography className="request-label">Service Name</Typography>
              <Typography className="request-service">{item.service}</Typography>
            </Stack>

            <Stack className="request-date-block" spacing={0.5}>
              <Typography className="request-label">Date</Typography>
              <Typography className="request-date">{item.date}</Typography>
            </Stack>

            <Stack className="request-note-block" spacing={0.5}>
              <Typography className="request-label">Customer Request</Typography>
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
                label="Completed"
                size="small"
                className={`request-status-chip ${item.status}`}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default CompletedServicesTab;
