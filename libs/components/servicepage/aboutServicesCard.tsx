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
};

const AboutServicesCard = ({ item }: ServicesCardProps) => {
  return (
    <Stack className="service-card">
      <Box className="service-image-wrap">
        <img className="service-image" src={item.image} alt={item.title} />
      </Box>
      <Stack className="content">
        <Box className="title">{item.title}</Box>
        <Box className="copy">{item.description}</Box>
        <Button
          variant="contained"
          className="btn"
          LinkComponent={Link}
          href="/service/detail"
        >
          Learn More
        </Button>
      </Stack>
    </Stack>
  );
};

export default AboutServicesCard;
