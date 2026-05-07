import { Box, Stack } from "@mui/material";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

const CsHeader = () => {
  return (
    <Stack className="container">
      <Stack className="cs-top">
        <Stack className="text-area">
          <Box className="hero-title">
            Need help? We've got you{" "}
            <span className="accent-line">
              covered 24/7 <img src="./img/logo/Union.svg" alt="" />
            </span>{" "}
          </Box>

          <Box className="text3">
            Get support for your orders, pets, or account. Our team is always
            ready to assist you.
          </Box>

          <Stack className="support-highlights" direction="row">
            <Stack className="support-pill-wrap">
              <Stack className="support-pill" direction="row">
                <SupportAgentRoundedIcon className="pill-icon purple" />
                <AccessTimeRoundedIcon className="pill-icon purple" />
                <Box>24/7 Support</Box>
              </Stack>
            </Stack>
          </Stack>
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
