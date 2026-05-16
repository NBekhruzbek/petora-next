import { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  trend?: string;
  trendNeutral?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
  trendNeutral,
}: StatCardProps) => {
  return (
    <Stack className="admin-stat-card" direction="row" alignItems="center">
      <Stack
        className="stat-icon-box"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: color }}
      >
        {icon}
      </Stack>
      <Stack className="stat-info">
        <Typography className="stat-value">
          {typeof value === "number" && value >= 1000
            ? value.toLocaleString()
            : value}
        </Typography>
        <Typography className="stat-label">{title}</Typography>
        {trend && <Typography className="stat-trend">{trend}</Typography>}
        {!trend && trendNeutral && (
          <Typography className="stat-trend-neutral">{trendNeutral}</Typography>
        )}
        {!trend && !trendNeutral && (
          <Typography className="stat-trend-neutral stat-icon-box-invisible">
            ·
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default StatCard;
