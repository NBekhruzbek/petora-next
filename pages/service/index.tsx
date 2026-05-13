import AboutServices from "@/libs/components/servicepage/aboutServices";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Stack } from "@mui/material";
import { NextPage } from "next";
import Agents from "@/libs/components/servicepage/Services";

const Service: NextPage = () => {
  return (
    <Stack className={"services-page"}>
      <AboutServices />
      <Agents />
    </Stack>
  );
};

export default withLayoutBasic(Service);
