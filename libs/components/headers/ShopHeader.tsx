import { Box, Stack } from "@mui/material";

const ShopHeader = () => {
  return (
    <Stack className="container">
      <Stack className="shop-top">
        <Stack className="text-area">
          <Box className={"text1"}>
            The most popular products{" "}
            <span>
              <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text2"}>Shop everything what you want!</Box>
          <Box className={"text3"}></Box>
        </Stack>
        <Box>
          <img
            src="/img/headers/shop-header2.svg"
            className="dog2-image"
            alt=""
          />
        </Box>
        <Box className={"products"}>
          <img
            className="product1"
            src="/img/headers/shop-header-product1.png"
            alt=""
          />
          <img
            className={"product2"}
            src="/img/headers/shop-header-product2.png"
            alt=""
          />
        </Box>
        <Stack sx={{ position: "relative" }}>
          <Box className={"circle-background"}>
            <img
              className="ellipse"
              src="/img/headers/EllipseServiceHeader.png"
              alt=""
            />
            <img
              className="ellipse2"
              src="/img/headers/EllipseServiceHeader.png"
              alt=""
            />
            <Box className={"dog-icon"}>
              <img src="/img/icons/Dog.svg" alt="" />
            </Box>
            <Box className={"cat-icon"}>
              <img src="/img/icons/Cat.svg" alt="" />
            </Box>
          </Box>
          <Box className={"dogs-image-wrapper"}>
            <img
              src="/img/headers/shop-header.png"
              className={"dogs-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ShopHeader;
