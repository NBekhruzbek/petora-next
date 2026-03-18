import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import PetNutrition from "@/libs/components/shoppage/PetNutrition";
import WellnessItems from "@/libs/components/shoppage/WellnessItems";
import { Container, Stack } from "@mui/material";
import { NextPage } from "next";

const ShopList: NextPage = () => {
  console.log("SHOP COMPONENT - PAGES ROUTER");
  return (
    <>
      <Stack className="shop-page">
        <WellnessItems />
        <PetNutrition />
      </Stack>
    </>
  );
};

export default withLayoutBasic(ShopList);
