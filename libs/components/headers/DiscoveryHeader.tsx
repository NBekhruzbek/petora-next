import { Box, Stack } from "@mui/material";

const DiscoveryHeader = () => {
  return (
    <Stack className="container">
      <Stack className="discovery-top">
        <Stack className="text-area">
          <Box className={"text1"}>Pet-Friendly </Box>
          <Box className={"text2"}>
            Homes
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text3"}>
            Discover pets on our site! Learn about their care and find your
            perfect companion.
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

export default DiscoveryHeader;
