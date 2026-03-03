import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";

type OfferItem = {
  id: number;
  title: string;
  description: string;
  tone: "purple" | "red";
};

const leftOffers: OfferItem[] = [
  {
    id: 1,
    title: "Day Care",
    description: "Safe daytime care with play, rest, and supervision for pets.",
    tone: "purple",
  },
  {
    id: 2,
    title: "Walking",
    description: "Regular walks to keep pets active, healthy, and happy.",
    tone: "red",
  },
  {
    id: 3,
    title: "Grooming",
    description:
      "Bathing, brushing, and grooming to keep pets clean and fresh.",
    tone: "purple",
  },
];

const rightOffers: OfferItem[] = [
  {
    id: 4,
    title: "Boarding",
    description: "Comfortable overnight stay with care and attention.",
    tone: "red",
  },
  {
    id: 5,
    title: "Training",
    description: "Basic obedience and behavior training for better habits.",
    tone: "purple",
  },
  {
    id: 6,
    title: "Veterinary",
    description: "Health checkups and medical care from professionals.",
    tone: "red",
  },
];

const WhatWeOffer = () => {
  return (
    <Stack className="what-we-offer">
      <Stack className="container">
        <Stack className="title-block">
          <Box className="title">
            WHAT WE OFFER
            <span>
              <img className="hand-icon" src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Button
            className="service-cta"
            component={Link}
            href="/service"
            variant="contained"
          >
            View Services
          </Button>
        </Stack>

        <Stack className="offer-content" direction="row">
          <Stack className="offers-column left-column">
            {leftOffers.map((offer) => (
              <Stack key={offer.id} className="offer-item left-item">
                <Box className="offer-copy">
                  <Box className="offer-title">{offer.title}</Box>
                  <Box className="offer-description">{offer.description}</Box>
                </Box>
                <Box className={`offer-number ${offer.tone}`}>{offer.id}</Box>
              </Stack>
            ))}
          </Stack>

          <Box className="dogs-stage">
            <Box className="ring ring-outer" />
            <Box className="ring ring-middle" />
            <Box className="ring ring-inner" />
            <img
              className="dogs-image"
              src="./img/headers/dogs-discovery-header.png"
              alt="Dogs group"
            />
          </Box>

          <Stack className="offers-column right-column">
            {rightOffers.map((offer) => (
              <Stack key={offer.id} className="offer-item right-item">
                <Box className={`offer-number ${offer.tone}`}>{offer.id}</Box>
                <Box className="offer-copy">
                  <Box className="offer-title">{offer.title}</Box>
                  <Box className="offer-description">{offer.description}</Box>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WhatWeOffer;
