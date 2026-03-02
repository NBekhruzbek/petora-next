import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";

const OurCompany = () => {
  return (
    <Stack className="our-company">
      <Stack className="container" direction="row">
        <Stack className="left-side">
          <Box className={"title"}>
            Our company{" "}
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Stack className="about-us">
            <Box className={"main-text"}>About us</Box>
            <Box className={"text"}>
              With 10 years of experience in the field of pet care and a team of
              experienced veterinarians, we are confident we can protect your
              pets from diseases they will get in the future. their nutrition
              and daily food intake.
            </Box>
            <Box className={"text"}>
              Loving and pampering your pet is not enough, it must also go hand
              in hand with their health and our service is where you can give
              your full trust.
            </Box>
          </Stack>
          <Stack className="about-consulting">
            <Box className={"main-text"}>About consulting</Box>
            <Box className={"text"}>
              Each pet species has a different habitat and behavior, so meet and
              consult directly with an animal specialist.
            </Box>
          </Stack>
          <Stack className="our-service">
            <Box className={"main-text"}>Our Service</Box>
            <Stack className="service-cards">
              <Stack className="left-card">
                <Stack className="text-area">
                  <Box className={"main-text"}>Physical checkup your pet</Box>
                  <Box className={"text"}>
                    Regular physical checkups are essential for maintain...
                  </Box>
                  <Button
                    className="read-more-button"
                    component={Link}
                    href="/service"
                    variant="contained"
                  >
                    Read More
                  </Button>
                </Stack>
                <img className="dog-image" src="./img/apcharka.png" alt="" />
              </Stack>
              <Stack className="right-card">
                <Stack className="text-area">
                  <Box className={"main-text"}>Spa</Box>
                  <Box className={"text"}>
                    Our pet spa offers a luxurios and relaxing ex...
                  </Box>
                  <Button
                    className="read-more-button"
                    component={Link}
                    href="/service"
                    variant="contained"
                  >
                    Read More
                  </Button>
                </Stack>
                <img className="dog-image" src="./img/spa-dog.png" alt="" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack className="right-side">
          <Box className={"dog-image-wrapper"}>
            <img
              className="background-dog"
              src="./img/our-company-background-dog.png"
              alt=""
            />
          </Box>
          <Box className={"dog-background"}></Box>
          <Box className={"rectangle1"}>
            <img src="./img/icons/Rectangle.png" alt="" />
          </Box>
          <Box className={"rectangle2"}>
            <img src="./img/icons/Rectangle.png" alt="" />
          </Box>
          <Box className={"rectangle3"}>
            <img src="./img/icons/Rectangle.png" alt="" />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OurCompany;
