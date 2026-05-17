import { Box, Stack } from "@mui/material";

const AgentsHeader = () => {
  return (
    <Stack className="container">
      <Stack className="agents-top">
        <Stack className="text-area">
          <Box className={"text1"}>Find Trusted</Box>
          <Box className={"text2"}>
            Pet Care Agents
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text3"}>
            Find verified pet care professionals near you. Browse agents by
            service, location, and ratings.
          </Box>
        </Stack>
        <Stack sx={{ position: "relative" }}>
          <Box className={"circle-background"}>
            <img
              className="ellipse"
              src="./img/headers/EllipseServiceHeader.png"
              alt=""
            />
            <Box className={"dog-icon"}>
              <img src="./img/icons/Dog.svg" alt="" />
            </Box>
            <Box className={"cat-icon"}>
              <img src="./img/icons/Cat.svg" alt="" />
            </Box>
          </Box>
          <Box>
            <img
              src="./img/headers/dogs-discovery-header.png"
              className={"dogs-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AgentsHeader;
