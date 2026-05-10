import React, { useState } from "react";
import {
  Stack, Typography, Box, Chip, Button, IconButton, Avatar, TextField, MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InboxIcon from "@mui/icons-material/Inbox";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TodayIcon from "@mui/icons-material/Today";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const MOCK_REQUESTS = [
  { id: 1, customer: "Kim Minsoo", pet: "Coco (Poodle)", service: "Premium Grooming", date: "May 12, 2026 · 10:00 AM", notes: "Sensitive skin, use gentle shampoo", status: "new", urgent: false, avatar: "KM" },
  { id: 2, customer: "Lee Jiyeon", pet: "Max (Golden Retriever)", service: "Dog Walking", date: "May 12, 2026 · 2:00 PM", notes: "Needs extra exercise, energetic dog", status: "pending", urgent: true, avatar: "LJ" },
  { id: 3, customer: "Park Soojin", pet: "Luna (Persian Cat)", service: "Cat Boarding", date: "May 13-15, 2026", notes: "Special diet required, medication at 8pm", status: "new", urgent: false, avatar: "PS" },
  { id: 4, customer: "Choi Dongwoo", pet: "Buddy (Beagle)", service: "Health Checkup", date: "May 14, 2026 · 11:00 AM", notes: "Annual vaccination due", status: "pending", urgent: false, avatar: "CD" },
  { id: 5, customer: "Yoon Hana", pet: "Mochi (Shih Tzu)", service: "Premium Grooming", date: "May 12, 2026 · 4:00 PM", notes: "", status: "new", urgent: true, avatar: "YH" },
];

const BookingRequestsTab = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const summaryCards = [
    { label: "New Requests", count: 3, icon: <InboxIcon />, color: "#6F2CFF" },
    { label: "Pending Approval", count: 2, icon: <PendingActionsIcon />, color: "#f59e0b" },
    { label: "Urgent Requests", count: 2, icon: <NotificationsActiveIcon />, color: "#ef4444" },
    { label: "Today's Requests", count: 3, icon: <TodayIcon />, color: "#10b981" },
  ];

  const filtered = MOCK_REQUESTS.filter((r) => statusFilter === "all" || r.status === statusFilter);

  return (
    <Stack spacing={3} className="booking-requests-tab">
      {/* Summary Cards */}
      <Stack direction="row" spacing={2} className="summary-cards-row">
        {summaryCards.map((card) => (
          <Box key={card.label} className="summary-card">
            <Box className="summary-card-icon" sx={{ background: `${card.color}12`, color: card.color }}>
              {card.icon}
            </Box>
            <Stack spacing={0.5}>
              <Typography className="summary-count">{card.count}</Typography>
              <Typography className="summary-label">{card.label}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Filter */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 160 }} className="filter-select">
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
      </Stack>

      {/* Request Cards */}
      <Stack spacing={2} className="requests-list">
        {filtered.map((req) => (
          <Stack key={req.id} className={`request-card ${req.urgent ? "urgent" : ""}`} direction="row" alignItems="center" spacing={2}>
            <Avatar className="request-avatar" sx={{ bgcolor: "#6F2CFF", width: 44, height: 44, fontSize: 14, fontWeight: 700 }}>
              {req.avatar}
            </Avatar>
            <Stack flex={1} spacing={0.3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography className="request-customer">{req.customer}</Typography>
                {req.urgent && <Chip icon={<WarningAmberIcon />} label="Urgent" size="small" className="urgent-chip" />}
              </Stack>
              <Typography className="request-pet">{req.pet}</Typography>
              <Typography className="request-service">{req.service}</Typography>
            </Stack>
            <Stack spacing={0.3} alignItems="flex-end" sx={{ minWidth: 180 }}>
              <Typography className="request-date">{req.date}</Typography>
              {req.notes && <Typography className="request-notes" title={req.notes}>📝 {req.notes.substring(0, 30)}…</Typography>}
              <Chip
                label={req.status === "new" ? "New" : "Pending"}
                size="small"
                className={`request-status-chip ${req.status}`}
              />
            </Stack>
            <Stack direction="row" spacing={0.5} className="request-actions">
              <IconButton size="small" className="action-accept" title="Accept"><CheckCircleIcon fontSize="small" /></IconButton>
              <IconButton size="small" className="action-decline" title="Decline"><CancelIcon fontSize="small" /></IconButton>
              <IconButton size="small" className="action-message" title="Message"><ChatBubbleOutlineIcon fontSize="small" /></IconButton>
              <IconButton size="small" className="action-view" title="View Details"><VisibilityIcon fontSize="small" /></IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default BookingRequestsTab;
