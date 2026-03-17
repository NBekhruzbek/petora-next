import PetYouLike from "@/libs/components/discoverypage/PetYouLike";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const Discovery: NextPage = () => {
  return (
    <>
      <Stack className="discovery-page">
        <PetYouLike />
      </Stack>
    </>
  );
};

export default withLayoutBasic(Discovery);
