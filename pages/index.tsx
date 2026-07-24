import { Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "@/libs/components/layout/LayoutHome";
import OurCompany from "@/libs/components/homepage/OurCompany";
import WhatWeOffer from "@/libs/components/homepage/WhatWeOffer";
import Species from "@/libs/components/homepage/Species";
import Advertisement from "@/libs/components/homepage/Advertisement";
import DiscountAdvertisement from "@/libs/components/homepage/DiscountAdvertisement";
import TopPetProducts from "@/libs/components/homepage/TopPetProducts";
import TopPetServices from "@/libs/components/homepage/TopPetServices";
import TopAgents from "@/libs/components/homepage/TopAgents";
import Discovery from "@/libs/components/homepage/Discovery";
import SocialMedia from "@/libs/components/homepage/SocialMedia";

const Home: NextPage = () => {
  return (
    <Stack className="home-page">
      <OurCompany />
      <WhatWeOffer />
      <Discovery />
      <Species />
      <DiscountAdvertisement />
      <TopPetProducts />
      <TopPetServices />
      <Advertisement />
      <TopAgents />
      <SocialMedia />
    </Stack>
  );
};

export default withLayoutMain(Home);
