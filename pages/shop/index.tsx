import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import WellnessItems from "@/libs/components/shoppage/WellnessItems";
import { Container, Stack } from "@mui/material";
import { NextPage } from "next";

const ShopList: NextPage = () => {
  console.log("SHOP COMPONENT - PAGES ROUTER");
  return (
    <>
      <Stack className="shop-page">
        <WellnessItems />
      </Stack>
    </>
  );
};

export default withLayoutBasic(ShopList);
