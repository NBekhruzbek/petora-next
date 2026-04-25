import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import SupportHub from "@/libs/components/cspage/SupportHub";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const CS: NextPage = () => {
  return (
    <Stack className="cs-page">
      <SupportHub />
    </Stack>
  );
};

export default withLayoutBasic(CS);
