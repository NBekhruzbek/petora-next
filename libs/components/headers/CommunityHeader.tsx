import { Box, Stack, Typography } from "@mui/material";

const CommunityHeader = () => {
  return (
    <Stack className="container">
      <Stack className="community-top">
        <Stack className="text-area">
          <Box className={"text2"}>Community Page</Box>
          <Box className={"text1"}>
            Discover Pet Stories & Tips
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text3"}>
            Share your pet stories, ask questions, and connect with fellow pet
            lovers.
          </Box>
        </Stack>
        <Box>
          <img className="news-logo" src="./img/headers/news-logo.png" alt="" />
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
          <Box className={"community-image-wrapper"}>
            <img
              src="./img/headers/community-header.png"
              className={"community-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommunityHeader;
