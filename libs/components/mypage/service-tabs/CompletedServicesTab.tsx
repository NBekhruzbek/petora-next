import React from "react";
import {
  Stack, Typography, Box, Chip, Button, IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReplayIcon from "@mui/icons-material/Replay";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const METRICS = [
  { label: "Total Completed", value: "384", icon: <CheckCircleIcon />, color: "#10b981", change: "+12 this month" },
  { label: "Monthly Rate", value: "96%", icon: <TrendingUpIcon />, color: "#6F2CFF", change: "+2.3%" },
  { label: "Average Rating", value: "4.8", icon: <StarIcon />, color: "#f59e0b", change: "Excellent" },
  { label: "Returning Customers", value: "67%", icon: <PeopleIcon />, color: "#3b82f6", change: "+5%" },
];

const COMPLETED = [
  { id: 1, pet: "Coco", owner: "Kim Minsoo", service: "Premium Grooming", date: "May 10, 2026", revenue: "₩45,000", rating: 5, emoji: "🐩", feedback: "Amazing grooming service! Coco looks perfect." },
  { id: 2, pet: "Rex", owner: "Jang Hyunwoo", service: "Dog Walking", date: "May 9, 2026", revenue: "₩25,000", rating: 4, emoji: "🐕", feedback: "Good walk, Rex enjoyed it." },
  { id: 3, pet: "Mimi", owner: "Song Eunji", service: "Cat Boarding", date: "May 8-9, 2026", revenue: "₩130,000", rating: 5, emoji: "🐱", feedback: "Mimi was very happy. Excellent care!" },
  { id: 4, pet: "Charlie", owner: "Oh Sehun", service: "Health Checkup", date: "May 7, 2026", revenue: "₩80,000", rating: 5, emoji: "🐶", feedback: "Thorough checkup, very professional." },
  { id: 5, pet: "Nabi", owner: "Han Yerin", service: "Premium Grooming", date: "May 6, 2026", revenue: "₩45,000", rating: 4, emoji: "🐈", feedback: "Good service overall." },
];

const CompletedServicesTab = () => {
  return (
    <Stack spacing={3} className="completed-services-tab">
      {/* Metric Cards */}
      <Stack direction="row" spacing={2} className="summary-cards-row">
        {METRICS.map((m) => (
          <Box key={m.label} className="summary-card">
            <Box className="summary-card-icon" sx={{ background: `${m.color}12`, color: m.color }}>
              {m.icon}
            </Box>
            <Stack spacing={0.3}>
              <Typography className="summary-count">{m.value}</Typography>
              <Typography className="summary-label">{m.label}</Typography>
              <Typography className="summary-change" sx={{ color: m.color }}>{m.change}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Completed List */}
      <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1f2937" }}>
        Service History
      </Typography>
      <Stack spacing={2}>
        {COMPLETED.map((item) => (
          <Stack key={item.id} className="completed-card" direction="row" alignItems="center" spacing={2}>
            <Box className="completed-emoji">{item.emoji}</Box>
            <Stack flex={1} spacing={0.3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography className="completed-pet">{item.pet}</Typography>
                <Chip label="Completed" size="small" icon={<CheckCircleIcon />} className="completed-chip" />
              </Stack>
              <Typography className="completed-owner">{item.owner} · {item.service}</Typography>
              <Typography className="completed-date">{item.date}</Typography>
            </Stack>
            <Stack spacing={0.5} alignItems="flex-end">
              <Typography className="completed-revenue">{item.revenue}</Typography>
              <Stack direction="row" spacing={0.3}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: 14, color: i < item.rating ? "#f59e0b" : "#e5e7eb" }} />
                ))}
              </Stack>
              {item.feedback && (
                <Typography className="completed-feedback">"{item.feedback.substring(0, 40)}…"</Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} className="btn-invoice">Invoice</Button>
              <Button variant="outlined" size="small" startIcon={<ReplayIcon />} className="btn-rebook">Rebook</Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default CompletedServicesTab;
