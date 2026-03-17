import Discovery from "@/libs/components/discoverypage/Discovery";
import PetYouLike from "@/libs/components/discoverypage/PetYouLike";
import UnderstandingYourPet from "@/libs/components/discoverypage/UnderstandingYourPet";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const DiscoveryPage: NextPage = () => {
  return (
    <>
      <Stack className="discovery-page">
        <PetYouLike />
        <UnderstandingYourPet />
        <Discovery />
      </Stack>
    </>
  );
};

export default withLayoutBasic(DiscoveryPage);
