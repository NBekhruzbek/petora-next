import { CSSProperties, ReactNode } from "react";
import { Stack, Typography } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

interface PendingState {
  activeLabel: string;
  clearLabel: string;
  count: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  caption?: string;
  pending?: PendingState;
}

const PendingBadge = ({ pending }: { pending: PendingState }) =>
  pending.count > 0 ? (
    <span className="stat-badge stat-badge--alert">
      <span className="stat-badge-dot" />
      {pending.activeLabel}
    </span>
  ) : (
    <span className="stat-badge stat-badge--clear">
      <span className="stat-badge-check">✓</span>
      {pending.clearLabel}
    </span>
  );

const StatCard = ({
  title,
  value,
  icon,
  color,
  caption,
  pending,
}: StatCardProps) => {
  return (
    <Stack
      className="admin-stat-card"
      direction="row"
      alignItems="center"
      style={{ "--stat-accent": color } as CSSProperties}
    >
      <Stack
        className="stat-icon-box"
        alignItems="center"
        justifyContent="center"
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
        {pending ? (
          <PendingBadge pending={pending} />
        ) : caption ? (
          <Typography className="stat-caption">{caption}</Typography>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default StatCard;

interface RevenueHeroProps {
  label: string;
  value: string;
  caption: string;
  icon: ReactNode;
}

export const RevenueHero = ({
  label,
  value,
  caption,
  icon,
}: RevenueHeroProps) => (
  <Stack className="admin-stat-hero" direction="row" alignItems="center">
    <PetsIcon className="hero-watermark" />
    <Stack className="hero-info">
      <Typography className="hero-label">{label}</Typography>
      <Typography className="hero-value">
        <span className="hero-currency">₩</span>
        {value}
      </Typography>
      <Typography className="hero-caption">{caption}</Typography>
    </Stack>
    <Stack
      className="hero-icon-box"
      alignItems="center"
      justifyContent="center"
    >
      {icon}
    </Stack>
  </Stack>
);
