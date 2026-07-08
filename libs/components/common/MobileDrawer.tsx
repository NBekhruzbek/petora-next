import { ReactNode } from "react";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DrawerAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  primaryAction?: DrawerAction;
  secondaryAction?: DrawerAction;
}

const MobileDrawer = ({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
}: MobileDrawerProps) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ className: "mobile-drawer-paper" }}
    >
      <Stack className="mobile-drawer">
        <Box className="mobile-drawer__grabber" aria-hidden="true" />

        <Stack className="mobile-drawer__header">
          <Typography className="mobile-drawer__header-title">
            {title}
          </Typography>
          <IconButton
            className="mobile-drawer__header-close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box className="mobile-drawer__content">{children}</Box>

        {(primaryAction || secondaryAction) && (
          <Stack className="mobile-drawer__footer" direction="row">
            {secondaryAction && (
              <button
                type="button"
                className="mobile-drawer__footer-secondary"
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                type="button"
                className="mobile-drawer__footer-primary"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </button>
            )}
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default MobileDrawer;
