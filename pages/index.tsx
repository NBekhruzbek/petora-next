import { Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "@/libs/components/layout/LayoutHome";
import OurCompany from "@/libs/components/homepage/OurCompany";
import WhatWeOffer from "@/libs/components/homepage/WhatWeOffer";
import Species from "@/libs/components/homepage/Species";
import Advertisement from "@/libs/components/homepage/Advertisement";
import DiscountAdvertisement from "@/libs/components/homepage/DiscountAdvertisement";
import TopPetFoods from "@/libs/components/homepage/TopPetFoods";
import TopPetToys from "@/libs/components/homepage/TopPetToys";
import TopAgents from "@/libs/components/homepage/TopAgents";
import Discovery from "@/libs/components/homepage/Discovery";
import SocialMedia from "@/libs/components/homepage/SocialMedia";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/query";

const Home: NextPage = () => {
  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 12,
        search: {
          // "productPetType": "CAT",
          // "productType": "FOOD",
          // "text": "Canin"
          // priceRange: {
          //   min: 1000,
          //   max: 100000,
          // },
        },
      },
    },
  });
  console.log("getProductsData => ", getProductsData);

  return (
    <Stack className="home-page">
      <OurCompany />
      <WhatWeOffer />
      <Discovery />
      <Species />
      <DiscountAdvertisement />
      <TopPetFoods />
      <TopPetToys />
      <Advertisement />
      <TopAgents />
      <SocialMedia />
    </Stack>
  );
};

export default withLayoutMain(Home);
