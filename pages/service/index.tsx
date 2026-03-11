import AboutServices from "@/libs/components/servicepage/aboutServices";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const Service: NextPage = () => {
  return (
    <Stack>
      <AboutServices />
    </Stack>
  );
};

export default withLayoutBasic(Service);
