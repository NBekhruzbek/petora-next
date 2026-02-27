import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";

const ServiceHeader = () => {
  return (
    <Stack className="container">
      <Stack className="service-header">
        <Stack className="text-area">
          <Box className={"text1"}>LOVE AND ATTENTION</Box>
          <Box className={"text2"}>for Your Furry Friends </Box>
          <Box className={"text3"}>
            Welcome to our pet care service, where your pets receive top-notch
            care and endless love
          </Box>
          <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
        </Stack>
        <Stack sx={{ position: "relative" }}>
          <Box className={"circle-background"}>
            <Box className={"ellipse"}>
              <img
                className="ellipse1"
                src="./img/headers/EllipseServiceHeader.png"
                alt=""
              />
              <img
                className="ellipse2"
                src="./img/headers/EllipseServiceHeader2.png"
                alt=""
              />
            </Box>
            <Box className={"dog-icon"}>
              <img src="./img/icons/Dog.svg" alt="" />
            </Box>
            <Box className={"cat-icon"}>
              <img src="./img/icons/Cat.svg" alt="" />
            </Box>
          </Box>
          <Stack className={"dog-card"}>
            <Stack className={"left"}>
              <Box className={"name"}>dr_Jane</Box>
              <Box className={"rank1"}></Box>
              <Box className={"rank2"}></Box>
              <Box className={"rank3"}>
                1k+{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="8"
                  viewBox="0 0 9 8"
                  fill="none"
                >
                  <path
                    d="M3.38018 0.568824C3.62661 -0.189608 4.69959 -0.189608 4.94602 0.568823L5.36444 1.8566C5.47465 2.19578 5.79073 2.42543 6.14736 2.42543H7.50141C8.29888 2.42543 8.63044 3.44589 7.98528 3.91463L6.88983 4.71052C6.60131 4.92014 6.48058 5.29171 6.59079 5.63089L7.00921 6.91867C7.25564 7.6771 6.38758 8.30779 5.74242 7.83905L4.64697 7.04316C4.35845 6.83353 3.96775 6.83353 3.67923 7.04316L2.58378 7.83905C1.93862 8.30779 1.07056 7.6771 1.31699 6.91867L1.73541 5.63089C1.84562 5.29171 1.72489 4.92014 1.43637 4.71052L0.340917 3.91463C-0.304243 3.44589 0.0273246 2.42543 0.824787 2.42543H2.17884C2.53547 2.42543 2.85155 2.19578 2.96176 1.8566L3.38018 0.568824Z"
                    fill="#6F00C6"
                  />
                </svg>
              </Box>
            </Stack>
            <Box className={"right"}>
              <img
                src="./img/headers/service-header-card.png"
                alt=""
                style={{
                  width: "98px",
                  height: "98px",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </Box>
          </Stack>
          <Box>
            <img
              src="./img/headers/dogs-service-header.png"
              className={"dogs-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ServiceHeader;
