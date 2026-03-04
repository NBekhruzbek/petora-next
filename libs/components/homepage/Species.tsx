import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";

const Species = () => {
  return (
    <Stack className={"species"}>
      <Stack className="container">
        <Stack className="species-main">
          <Stack className="left-side">
            <img className="dog-image" src="./img/Discovery-dog.png" alt="" />
            <Box className={"dog-background-1"}></Box>
            <Box className={"dog-background-2"}></Box>
            <img className="bone" src="./img/bone.png" alt="" />
            <Box className={"bone-background"}></Box>
            <img className="toy" src="./img/dog-toy.png" alt="" />
            <Box className={"toy-background"}></Box>
            <img className="bowl" src="./img/dog-bowl.png" alt="" />
            <Box className={"bowl-background"}></Box>
          </Stack>
          <Stack className="right-side">
            <Box className={"title"}>Species</Box>
            <Box className={"text"}>
              Each dog has a different breed and characteristics, so their
              lifestyle, nutrition and even entertainment are different, please
              bring your pet to our store for advice. by experts
            </Box>
            <Button
              variant="contained"
              component={Link}
              href="/service"
              className="booking-button"
            >
              Booking Day For Your Pet Now
            </Button>
            <img className="hand-icon1" src="./img/Union1.svg" alt="" />
            <img className="hand-icon2" src="./img/Union2.svg" alt="" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Species;
