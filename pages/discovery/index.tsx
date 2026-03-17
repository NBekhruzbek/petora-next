import PetYouLike from "@/libs/components/discoverypage/PetYouLike";
import UnderstandingYourPet from "@/libs/components/discoverypage/UnderstandingYourPet";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const Discovery: NextPage = () => {
  return (
    <>
      <Stack className="discovery-page">
        <PetYouLike />
        <UnderstandingYourPet />
      </Stack>
    </>
  );
};

export default withLayoutBasic(Discovery);
