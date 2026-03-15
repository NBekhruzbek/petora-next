import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Box, Stack } from "@mui/material";

const Booking = () => {
  return (
    <Stack className="booking-page">
      <Box className={"top"}></Box>
      <Stack className="container">Booking</Stack>
    </Stack>
  );
};

export default withLayoutBasic(Booking);
