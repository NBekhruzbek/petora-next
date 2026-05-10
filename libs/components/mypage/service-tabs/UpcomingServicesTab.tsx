import React from "react";
import { Stack, Typography, Box, Chip, Button, Avatar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const DAYS = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const UPCOMING = [
  { id: 1, pet: "Coco", owner: "Kim Minsoo", type: "Premium Grooming", time: "10:00 AM", date: "May 12", countdown: "1d 12h", emoji: "🐩", status: "confirmed", checklist: [true, true, false, false] },
  { id: 2, pet: "Max", owner: "Lee Jiyeon", type: "Dog Walking", time: "2:00 PM", date: "May 12", countdown: "1d 16h", emoji: "🦮", status: "confirmed", checklist: [true, false, false, false] },
  { id: 3, pet: "Luna", owner: "Park Soojin", type: "Cat Boarding", time: "Check-in 5 PM", date: "May 13", countdown: "2d 5h", emoji: "🐱", status: "confirmed", checklist: [false, false, false, false] },
  { id: 4, pet: "Buddy", owner: "Choi Dongwoo", type: "Health Checkup", time: "11:00 AM", date: "May 14", countdown: "3d 11h", emoji: "🐕", status: "confirmed", checklist: [false, false, false, false] },
];

const CHECKLIST_ITEMS = ["Prepare equipment", "Review pet notes", "Confirm with owner", "Setup workspace"];

const CALENDAR_EVENTS: Record<string, string[]> = {
  "Mon 12": ["10:00", "14:00"],
  "Tue 13": ["17:00"],
  "Wed 14": [],
  "Thu 15": ["11:00"],
  "Fri 16": ["09:00", "15:00"],
  "Sat 17": ["10:00", "11:00", "14:00"],
  "Sun 18": [],
};

const UpcomingServicesTab = () => {
  return (
    <Stack spacing={3} className="upcoming-services-tab">
      {/* Weekly Calendar */}
      <Box className="weekly-calendar-card">
        <Typography className="calendar-title">Weekly Schedule — May 12–18, 2026</Typography>
        <Box className="calendar-grid">
          <Box className="calendar-header">
            <Box className="time-col" />
            {DAYS.map((d) => (
              <Box key={d} className={`day-col-header ${d.startsWith("Mon") ? "today" : ""}`}>
                {d}
              </Box>
            ))}
          </Box>
          {HOURS.map((hour) => (
            <Box key={hour} className="calendar-row">
              <Box className="time-col">{hour}</Box>
              {DAYS.map((day) => {
                const hasEvent = CALENDAR_EVENTS[day]?.includes(hour);
                return (
                  <Box key={day} className={`day-cell ${hasEvent ? "has-event" : ""}`}>
                    {hasEvent && <Box className="event-dot" />}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Upcoming Booking Cards */}
      <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1f2937" }}>
        Upcoming Appointments ({UPCOMING.length})
      </Typography>
      <Stack spacing={2}>
        {UPCOMING.map((item) => (
          <Stack key={item.id} className="upcoming-card" direction="row" spacing={3} alignItems="center">
            <Box className="upcoming-emoji">{item.emoji}</Box>
            <Stack flex={1} spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography className="upcoming-pet">{item.pet}</Typography>
                <Chip label={item.status} size="small" className="status-chip-confirmed" />
              </Stack>
              <Typography className="upcoming-owner">{item.owner}</Typography>
              <Typography className="upcoming-type">{item.type}</Typography>
            </Stack>
            <Stack spacing={0.5} alignItems="center">
              <Typography className="upcoming-date">{item.date}</Typography>
              <Typography className="upcoming-time">{item.time}</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" className="countdown-badge">
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography className="countdown-text">{item.countdown}</Typography>
              </Stack>
            </Stack>
            <Stack spacing={0.5} className="checklist-mini">
              {CHECKLIST_ITEMS.map((task, idx) => (
                <Stack key={task} direction="row" spacing={0.5} alignItems="center" className="checklist-item">
                  {item.checklist[idx] ? (
                    <CheckBoxIcon sx={{ fontSize: 16, color: "#10b981" }} />
                  ) : (
                    <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, color: "#d1d5db" }} />
                  )}
                  <Typography className="checklist-text">{task}</Typography>
                </Stack>
              ))}
            </Stack>
            <Stack spacing={1}>
              <Button variant="contained" size="small" startIcon={<PlayArrowIcon />} className="btn-start-service">
                Start
              </Button>
              <Button variant="outlined" size="small" startIcon={<PhoneIcon />} className="btn-contact">
                Contact
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default UpcomingServicesTab;
