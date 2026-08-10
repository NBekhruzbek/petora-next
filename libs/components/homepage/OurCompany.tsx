import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const OurCompany = () => {
  const { t } = useTranslation();

  return (
    <Stack className="our-company">
      <Stack className="container" direction="row">
        <Stack className="left-side">
          <Box className={"title"}>
            {t("home.ourCompany.title")}{" "}
            <span>
              <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Stack className="about-us">
            <Box className={"main-text"}>
              {t("home.ourCompany.aboutUsTitle")}
            </Box>
            <Box className={"text"}>{t("home.ourCompany.aboutUsText1")}</Box>
            <Box className={"text"}>{t("home.ourCompany.aboutUsText2")}</Box>
          </Stack>
          <Stack className="about-consulting">
            <Box className={"main-text"}>
              {t("home.ourCompany.consultingTitle")}
            </Box>
            <Box className={"text"}>{t("home.ourCompany.consultingText")}</Box>
          </Stack>
          <Stack className="our-service">
            <Box className={"main-text"}>
              {t("home.ourCompany.serviceTitle")}
            </Box>
            <Stack className="service-cards">
              <Stack className="left-card">
                <Stack className="text-area">
                  <Box className={"main-text"}>
                    {t("home.ourCompany.checkupTitle")}
                  </Box>
                  <Box className={"text"}>
                    {t("home.ourCompany.checkupText")}
                  </Box>
                  <Button
                    className="read-more-button"
                    component={Link}
                    href="/service"
                    variant="contained"
                  >
                    {t("actions.readMore")}
                  </Button>
                </Stack>
                <img className="dog-image" src="/img/apcharka.png" alt="" />
              </Stack>
              <Stack className="right-card">
                <Stack className="text-area">
                  <Box className={"main-text"}>
                    {t("home.ourCompany.groomingTitle")}
                  </Box>
                  <Box className={"text"}>
                    {t("home.ourCompany.groomingText")}
                  </Box>
                  <Button
                    className="read-more-button"
                    component={Link}
                    href="/service"
                    variant="contained"
                  >
                    {t("actions.readMore")}
                  </Button>
                </Stack>
                <img className="dog-image" src="/img/spa-dog.png" alt="" />
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
              src="/img/pets/PetLogin.png"
              alt="Our company dog"
            />
            {/* Gradient footer inside card */}
            <div className="oc-card-footer" />
          </Stack>

          {/* Floating stat badges */}
          <Stack className="oc-badge oc-badge-1">
            <span className="oc-badge-num">10+</span>
            <span className="oc-badge-label">
              {t("home.ourCompany.yearsExperience")}
            </span>
          </Stack>
          <Stack className="oc-badge oc-badge-2">
            <span className="oc-badge-num">500+</span>
            <span className="oc-badge-label">
              {t("home.ourCompany.happyPets")}
            </span>
          </Stack>
          <Stack className="oc-badge oc-badge-3">
            <span className="oc-badge-num">50+</span>
            <span className="oc-badge-label">
              {t("home.ourCompany.expertVets")}
            </span>
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
