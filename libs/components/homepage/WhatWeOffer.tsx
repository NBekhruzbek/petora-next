import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type OfferItem = {
  id: number;
  key: string;
  tone: "purple" | "red";
};

const leftOffers: OfferItem[] = [
  { id: 1, key: "dayCare", tone: "purple" },
  { id: 2, key: "walking", tone: "red" },
  { id: 3, key: "grooming", tone: "purple" },
];

const rightOffers: OfferItem[] = [
  { id: 4, key: "boarding", tone: "red" },
  { id: 5, key: "training", tone: "purple" },
  { id: 6, key: "veterinary", tone: "red" },
];

const WhatWeOffer = () => {
  const { t } = useTranslation();

  return (
    <Stack className="what-we-offer">
      <Stack className="container">
        <Stack className="title-block">
          <Box className="title">
            {t("home.whatWeOffer.title")}
            <span>
              <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Button
            className="service-cta"
            component={Link}
            href="/service"
            variant="contained"
          >
            {t("home.whatWeOffer.cta")}
          </Button>
        </Stack>

        <Stack className="offer-content" direction="row">
          <Stack className="offers-column left-column">
            {leftOffers.map((offer) => (
              <Stack key={offer.id} className="offer-item left-item">
                <Box className="offer-copy">
                  <Box className="offer-title">
                    {t(`home.whatWeOffer.${offer.key}.title`)}
                  </Box>
                  <Box className="offer-description">
                    {t(`home.whatWeOffer.${offer.key}.desc`)}
                  </Box>
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
              src="/img/headers/dogs-discovery-header.png"
              alt="Dogs group"
            />
          </Box>

          <Stack className="offers-column right-column">
            {rightOffers.map((offer) => (
              <Stack key={offer.id} className="offer-item right-item">
                <Box className={`offer-number ${offer.tone}`}>{offer.id}</Box>
                <Box className="offer-copy">
                  <Box className="offer-title">
                    {t(`home.whatWeOffer.${offer.key}.title`)}
                  </Box>
                  <Box className="offer-description">
                    {t(`home.whatWeOffer.${offer.key}.desc`)}
                  </Box>
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
