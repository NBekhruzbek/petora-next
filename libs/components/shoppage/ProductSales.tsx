import { Box, Stack } from "@mui/material";

const ProductSales = () => {
  return (
    <Stack className="product-sales-section">
      <Stack className="container">
        <Stack className="main-section">
          <img
            className={"pets-image"}
            src="/img/pets/pets-for-sale-section1.png"
            alt=""
          />
          <Box className="sun-shine-wrap">
            <img className="sun-shine" src="/img/sunShine.png" alt="" />
          </Box>
          <img className="left-lemon" src="./img/lemon2.png" alt="" />
          <Stack className="board">
            <img className="wood" src="./img/wood.png" alt="" />
            <Box className={"title"}>The Summer Sale</Box>
            <img className="hand-icon" src="./img/icons/hand-icon.svg" alt="" />
          </Stack>
          <img className="leav" src="./img/leav.png" alt="" />
          <img className="leav2" src="./img/leav2.png" alt="" />
          <img className="wellness" src="./img/products/wellness.png" alt="" />
          <svg
            className="wellness-bottom"
            xmlns="http://www.w3.org/2000/svg"
            width="349"
            height="108"
            viewBox="0 0 349 108"
            fill="none"
          >
            <g filter="url(#filter0_f_671_3925)">
              <path
                d="M192 86.5C67.6 93.7 25.5 69.5 20 56.5L253.5 20L328.5 56.5L192 86.5Z"
                fill="#094120"
                fill-opacity="0.4"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_671_3925"
                x="0"
                y="0"
                width="348.5"
                height="107.812"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10"
                  result="effect1_foregroundBlur_671_3925"
                />
              </filter>
            </defs>
          </svg>
          <img className="fillet" src="./img/products/fillet.png" alt="" />
          <svg
            className="box-shadow"
            xmlns="http://www.w3.org/2000/svg"
            width="533"
            height="163"
            viewBox="0 0 533 163"
            fill="none"
          >
            <g filter="url(#filter0_f_671_3929)">
              <path
                d="M75 142.5L20 103.5L273 20L452 23L513 32L75 142.5Z"
                fill="#094120"
                fill-opacity="0.6"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_671_3929"
                x="0"
                y="0"
                width="533"
                height="162.5"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10"
                  result="effect1_foregroundBlur_671_3929"
                />
              </filter>
            </defs>
          </svg>
          <img className="box" src="./img/box.png" alt="" />
          <img className="lemons" src="./img/lemons.svg" alt="" />
          <svg
            className="fillet-shadow"
            xmlns="http://www.w3.org/2000/svg"
            width="407"
            height="459"
            viewBox="0 0 407 459"
            fill="none"
          >
            <g filter="url(#filter0_f_671_3938)">
              <path
                d="M289.5 439L20 400L286.5 35.5L318.5 20L386.5 25L359.5 355.5L289.5 439Z"
                fill="#094120"
                fill-opacity="0.6"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_671_3938"
                x="0"
                y="0"
                width="406.5"
                height="459"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10"
                  result="effect1_foregroundBlur_671_3938"
                />
              </filter>
            </defs>
          </svg>
          <img className="right-lemon" src="./img/lemon1.png" alt="" />
          <img className="bottom-leav" src="./img/leav.png" alt="" />
        </Stack>
      </Stack>
      <img className="bottom-shade" src="./img/bottom-shade.png" alt="" />
    </Stack>
  );
};

export default ProductSales;
