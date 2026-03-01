import { Box, Stack } from "@mui/material";

const ShopHeader = () => {
  return (
    <Stack className="container">
      <Stack className="mypage-top">
        <Stack className="text-area">
          <Box className={"text2"}>
            My Page
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text1"}>
            Keep your profile ready for your pet journey!{" "}
          </Box>
          <Box className={"text3"}></Box>
        </Stack>
        <Box>
          <img
            src="./img/headers/my-page-dog.png"
            className="pets-image"
            alt=""
          />
        </Box>
        <Box>
          <img className="cat" src="./img/headers/cat.png" alt="" />
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
          <Box className={"girl-image-wrapper"}>
            <img
              src="./img/headers/my-page.png"
              className={"girl-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ShopHeader;
