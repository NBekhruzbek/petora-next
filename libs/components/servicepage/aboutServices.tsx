import { Box, Stack } from "@mui/material";
import AboutServicesCard, { ServicesItem } from "./aboutServicesCard";

const services: ServicesItem[] = [
  {
    id: "service-1",
    title: "Grooming",
    description:
      "Gentle baths, coat trims, and nail care to keep your pet clean and comfortable.",
    image: "./img/services/grooming.jpg",
  },
  {
    id: "service-2",
    title: "Training",
    description:
      "Positive, reward-based sessions that build good habits and confidence.",
    image: "./img/services/training.jpg",
  },
  {
    id: "service-3",
    title: "Veterinary",
    description:
      "Preventive checkups and treatment with care that puts your pet first.",
    image: "./img/services/veterinary.png",
  },
  {
    id: "service-4",
    title: "Day Care",
    description:
      "A safe, social space for play, rest, and supervised enrichment.",
    image: "./img/services/day-care.jpg",
  },
  {
    id: "service-5",
    title: "Pet Boarding",
    description:
      "Cozy stays with attentive staff, daily routines, and plenty of love.",
    image: "./img/services/boarding.png",
  },
  {
    id: "service-6",
    title: "Walking",
    description:
      "Reliable walks that keep your pet active, happy, and well-exercised.",
    image: "./img/services/walking.jpg",
  },
];

const AboutServices = () => {
  return (
    <Stack className="service-page">
      <Stack className="about-services">
        <Stack className="container">
          <Stack className="about-services__header">
            <Box className="about-services__eyebrow-text">
              Service We Provide{" "}
              <span>
                <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
              </span>
            </Box>
            <Box className="about-services__title">
              Quality <span className="text-color">Care For</span> <br />
              Your Little Ones
            </Box>
          </Stack>
          <Box className="services-marquee">
            <Stack className="services-track" direction="row">
              {[0, 1].map((loopIndex) => (
                <Stack
                  key={loopIndex}
                  className="service-segment"
                  direction="row"
                >
                  {services.map((service) => (
                    <Box
                      key={`${loopIndex}-${service.id}`}
                      className="service-item"
                    >
                      <AboutServicesCard item={service} />
                    </Box>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AboutServices;
