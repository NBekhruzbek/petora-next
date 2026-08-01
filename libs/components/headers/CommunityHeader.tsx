import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const CommunityHeader = () => {
  const { t } = useTranslation();

  return (
    <Stack className="container">
      <Stack className="community-top">
        <Stack className="text-area">
          <Box className={"text2"}>{t("headers.community.eyebrow")}</Box>
          <Box className={"text1"}>
            {t("headers.community.title")}
            <span>
              <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Box className={"text3"}>{t("headers.community.subtitle")}</Box>
        </Stack>
        <Box>
          <img className="news-logo" src="/img/headers/news-logo.png" alt="" />
        </Box>
        <Stack className="hero-stage" sx={{ position: "relative" }}>
          <Box className={"circle-background"}>
            <img
              className="ellipse"
              src="/img/headers/EllipseServiceHeader.png"
              alt=""
            />
            <img
              className="ellipse2"
              src="/img/headers/EllipseServiceHeader.png"
              alt=""
            />
            <Box className={"dog-icon"}>
              <img src="/img/icons/Dog.svg" alt="" />
            </Box>
            <Box className={"cat-icon"}>
              <img src="/img/icons/Cat.svg" alt="" />
            </Box>
          </Box>
          <Box className={"community-image-wrapper"}>
            <img
              src="/img/headers/community-header.png"
              className={"community-image"}
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommunityHeader;
