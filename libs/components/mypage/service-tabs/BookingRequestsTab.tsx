import React, { useState } from "react";
import { Stack, Typography, Chip, Button } from "@mui/material";

const MOCK_REQUESTS = [
  {
    id: 1,
    service: "Premium Grooming",
    date: "May 12, 2026 · 10:00 AM",
    request: "Sensitive skin, use gentle shampoo.",
    status: "pending",
  },
  {
    id: 2,
    service: "Dog Walking",
    date: "May 12, 2026 · 2:00 PM",
    request: "Needs extra exercise, energetic dog.",
    status: "pending",
  },
  {
    id: 3,
    service: "Cat Boarding",
    date: "May 13-15, 2026",
    request: "Special diet required, medication at 8pm.",
    status: "pending",
  },
  {
    id: 4,
    service: "Health Checkup",
    date: "May 14, 2026 · 11:00 AM",
    request: "Annual vaccination due.",
    status: "pending",
  },
  {
    id: 5,
    service: "Premium Grooming",
    date: "May 12, 2026 · 4:00 PM",
    request: "",
    status: "pending",
  },
];

const BookingRequestsTab = () => {
  const [requestStatuses, setRequestStatuses] = useState<
    Record<number, string>
  >({});

  const getRequestStatus = (request: (typeof MOCK_REQUESTS)[number]) => {
    return requestStatuses[request.id] || request.status;
  };

  const acceptRequest = (requestId: number) => {
    setRequestStatuses((prev) => ({ ...prev, [requestId]: "accepted" }));
  };

  return (
    <Stack spacing={1.5} className="booking-requests-tab">
      <Stack spacing={1.5} className="requests-list">
        {MOCK_REQUESTS.map((req) => {
          const status = getRequestStatus(req);

          return (
            <Stack
              key={req.id}
              className="request-row"
              direction="row"
              alignItems="center"
            >
              <Stack className="request-main" spacing={0.5}>
                <Typography className="request-label">Service Name</Typography>
                <Typography className="request-service">
                  {req.service}
                </Typography>
              </Stack>

              <Stack className="request-date-block" spacing={0.5}>
                <Typography className="request-label">Date</Typography>
                <Typography className="request-date">{req.date}</Typography>
              </Stack>

              <Stack className="request-note-block" spacing={0.5}>
                <Typography className="request-label">
                  Customer Request
                </Typography>
                <Typography className="request-note">
                  {req.request || "No additional request"}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                className="request-status-actions"
              >
                <Chip
                  label={status === "accepted" ? "Accepted" : "Pending"}
                  size="small"
                  className={`request-status-chip ${status}`}
                />
                {status === "pending" && (
                  <Button
                    className="request-accept-btn"
                    onClick={() => acceptRequest(req.id)}
                  >
                    Accept
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

export default BookingRequestsTab;
