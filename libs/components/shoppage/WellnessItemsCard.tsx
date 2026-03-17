import { Box, Stack } from "@mui/material";
import { type CSSProperties } from "react";

export type WellnessItem = {
  id: string;
  name: string;
  image: string;
};

type WellnessItemsCardProps = {
  item: WellnessItem;
  active?: boolean;
  onSelect?: () => void;
  style?: CSSProperties;
};

const WellnessItemsCard = ({
  item,
  active = false,
  onSelect,
  style,
}: WellnessItemsCardProps) => {
  return (
    <Stack
      className={`wellness-card ${active ? "active" : ""}`}
      style={style}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
    >
      <Box className="card-image">
        <img src={item.image} alt={item.name} />
      </Box>
      <Box className="card-title">{item.name}</Box>
    </Stack>
  );
};

export default WellnessItemsCard;
