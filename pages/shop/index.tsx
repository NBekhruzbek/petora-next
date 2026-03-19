import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import DiscountAdvertisement from "@/libs/components/shoppage/DiscountAdvertisement";
import PetNutrition from "@/libs/components/shoppage/PetNutrition";
import ProductSales from "@/libs/components/shoppage/ProductSales";
import WellnessItems from "@/libs/components/shoppage/WellnessItems";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const ShopList: NextPage = () => {
  console.log("SHOP COMPONENT - PAGES ROUTER");
  return (
    <>
      <Stack className="shop-page">
        <WellnessItems />
        <PetNutrition />
        <ProductSales />
        <DiscountAdvertisement />
      </Stack>
    </>
  );
};

export default withLayoutBasic(ShopList);
