import { Box, Stack } from "@mui/material";

const ShopHeader = () => {
  return (
    <Stack className="container">
      <Stack className="shop-top">
        <Stack className="text-area">
          <Box className={"text2"}>Agents List</Box>
          <Box className={"text1"}>
            we keep them happy{" "}
            <span>
              <img src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text3"}></Box>
        </Stack>
        <Box>
          <img
            src="./img/headers/agents-header-pets.png"
            className="pets-image"
            alt=""
          />
        </Box>
        <Box>
          <img
            className="reserve-now-logo"
            src="./img/headers/reserve-now.png"
            alt=""
          />
        </Box>
        <Stack sx={{ position: "relative" }}>
          <Box className={"circle-background"}>
            <img
              className="ellipse"
              src="./img/headers/EllipseServiceHeader.png"
              alt=""
            />
            <img
              className="ellipse2"
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
          <Box className={"agent-image-wrapper"}>
            <img
              src="./img/headers/agent-header.png"
              className={"agent-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ShopHeader;
