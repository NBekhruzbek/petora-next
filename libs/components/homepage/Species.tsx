import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Species = () => {
  const { t } = useTranslation();

  return (
    <Stack className={"species"}>
      <Stack className="container">
        <Stack className="species-main">
          <Stack className="left-side">
            <img className="dog-image" src="/img/Discovery-dog.png" alt="" />
            <Box className={"dog-background-1"}></Box>
            <Box className={"dog-background-2"}></Box>
            <img className="bone" src="/img/bone.png" alt="" />
            <Box className={"bone-background"}></Box>
            <img className="toy" src="/img/dog-toy.png" alt="" />
            <Box className={"toy-background"}></Box>
            <img className="bowl" src="/img/dog-bowl.png" alt="" />
            <Box className={"bowl-background"}></Box>
          </Stack>
          <Stack className="right-side">
            <Box className={"title"}>{t("home.species.title")}</Box>
            <Box className={"text"}>{t("home.species.text")}</Box>
            <Button
              variant="contained"
              component={Link}
              href="/service"
              className="booking-button"
            >
              {t("home.species.cta")}
            </Button>
            <img className="hand-icon1" src="/img/Union1.svg" alt="" />
            <img className="hand-icon2" src="/img/Union2.svg" alt="" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Species;
