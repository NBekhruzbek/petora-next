import { useTranslation } from "react-i18next";
import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";

const DiscountAdvertisement = () => {
  const { t } = useTranslation();
  return (
    <Stack className="discount-ads">
      <Stack className="container">
        <Stack className="discount-ads-main">
          <img className="back-image" src="/img/discount-ads-back.jpg" alt="" />
          <img className="leaf-1" src="/img/dis-ads-leaf-1.png" alt="" />
          <img className="leaf-2" src="/img/dis-ads-leaf-2.png" alt="" />
          <img className="leaf-3" src="/img/dis-ads-leaf-3.png" alt="" />
          <img className="leaf-4" src="/img/dis-ads-leaf-4.png" alt="" />
          <img className="wood" src="/img/dis-ads-wood.png" alt="" />
          <img className="grass" src="/img/dis-ads-grass.png" alt="" />
          <p className="the">{t("promo.the")}</p>
          <p className="summer">
            {t("promo.summer")} <span className="sale">{t("promo.sale")}</span>
          </p>
          <img className="dog" src="/img/dis-ads-dog.svg" alt="" />
          <Stack className="main-area">
            <Box className={"saving-percent"}>{t("promo.saving")}</Box>
            <Box className={"title"}>{t("promo.title")}</Box>
            <Box className={"text"}>{t("promo.text")}</Box>
          </Stack>
          <Box className={"products"}>
            <img
              className="product1"
              src="/img/headers/shop-header-product1.png"
              alt=""
            />
            <img
              className={"product2"}
              src="/img/headers/shop-header-product2.png"
              alt=""
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DiscountAdvertisement;
