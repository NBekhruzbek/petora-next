import { ReactNode } from "react";
import { Button, Stack, Typography } from "@mui/material";

/**
 * The one empty state for MyPage panels.
 *
 * Deliberately not the app's `no-data.png` magnifier: that one means "your
 * search found nothing", which is a different message from "you have not done
 * this yet". These panels are almost always somebody's first visit, so each one
 * names where the missing thing comes from and offers the action that produces
 * it.
 */

interface EmptyStateProps {
  /** The panel's own icon, so the empty state still reads as that panel. */
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

const PawPrint = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <ellipse cx="12" cy="16.4" rx="5.6" ry="4.6" />
    <ellipse cx="5.5" cy="10.4" rx="2.5" ry="3.2" transform="rotate(-20 5.5 10.4)" />
    <ellipse cx="9.9" cy="7.2" rx="2.4" ry="3.3" transform="rotate(-7 9.9 7.2)" />
    <ellipse cx="14.5" cy="7.2" rx="2.4" ry="3.3" transform="rotate(7 14.5 7.2)" />
    <ellipse cx="18.9" cy="10.4" rx="2.5" ry="3.2" transform="rotate(20 18.9 10.4)" />
  </svg>
);

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Stack className="empty-state">
    {/* A trail that runs out: nothing has come through here yet. Ambient, so it
        sits behind the disc and fades rather than competing with the copy. */}
    <Stack className="empty-state-stage">
      <PawPrint className="empty-state-paw paw-1" />
      <PawPrint className="empty-state-paw paw-2" />
      <PawPrint className="empty-state-paw paw-3" />
      <Stack className="empty-state-disc">{icon}</Stack>
    </Stack>

    <Stack className="empty-state-copy">
      <Typography className="empty-state-title">{title}</Typography>
      <Typography className="empty-state-text">{description}</Typography>
    </Stack>

    {action && (
      <Button className="empty-state-action" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </Stack>
);

export default EmptyState;
