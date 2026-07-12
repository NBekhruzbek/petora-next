import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { CSSProperties } from "react";

export type ServicesItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type ServicesCardProps = {
  item: ServicesItem;
  isOpen?: boolean;
  onToggle?: () => void;
};

const AboutServicesCard = ({ item, isOpen, onToggle }: ServicesCardProps) => {
  return (
    <Stack
      className={`service-card${isOpen ? " is-open" : ""}`}
      onClick={onToggle}
    >
      <Box className="service-image-wrap">
        <img className="service-image" src={item.image} alt={item.title} />
      </Box>
      <Stack className="content">
        <Box className="title">{item.title}</Box>
        <Box className="copy">{item.description}</Box>
      </Stack>
    </Stack>
  );
};

export default AboutServicesCard;
