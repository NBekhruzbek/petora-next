import { Box, Stack } from "@mui/material";

const CsHeader = () => {
  return (
    <Stack className="container">
      <Stack className="cs-top">
        <Stack className="text-area">
          <Box className={"text2"}>CS Page</Box>
          <Box className={"text1"}>
            If you need help, contact us 24/7!
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text3"}></Box>
        </Stack>
        <Box>
          <img src="./img/headers/cs-image.png" className="cs-image" alt="" />
        </Box>
        <Box>
          <img className="faq-icon" src="./img/headers/faq-icon.png" alt="" />
        </Box>
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
          <Box className={"cs-image-wrapper"}>
            <img
              src="./img/headers/cs-header.png"
              className={"cs-main-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CsHeader;
