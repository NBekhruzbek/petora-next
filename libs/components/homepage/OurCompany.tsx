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
                    Regular physical checkups are essential for maintaining
                    your pet's health.
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
                    Our pet spa offers a luxurious and relaxing experience for
                    your pet.
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
          {/* Tilted accent cards behind */}
          <div className="oc-layer oc-layer-back" />
          <div className="oc-layer oc-layer-mid" />

          {/* Main card */}
          <Stack className="oc-card">
            <img
              className="oc-dog-img"
              src="./img/pets/petlogin.png"
              alt="Our company dog"
            />
            {/* Gradient footer inside card */}
            <div className="oc-card-footer" />
          </Stack>

          {/* Floating stat badges */}
          <Stack className="oc-badge oc-badge-1">
            <span className="oc-badge-num">10+</span>
            <span className="oc-badge-label">Years Experience</span>
          </Stack>
          <Stack className="oc-badge oc-badge-2">
            <span className="oc-badge-num">500+</span>
            <span className="oc-badge-label">Happy Pets</span>
          </Stack>
          <Stack className="oc-badge oc-badge-3">
            <span className="oc-badge-num">50+</span>
            <span className="oc-badge-label">Expert Vets</span>
          </Stack>

          {/* Decorative dots */}
          <div className="oc-dot oc-dot-1" />
          <div className="oc-dot oc-dot-2" />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OurCompany;
