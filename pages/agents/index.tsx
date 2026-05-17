import Agents from "@/libs/components/agentspage/Agents";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const AgentsPage: NextPage = () => {
  return (
    <Stack className="agents-page">
      <Agents />
    </Stack>
  );
};

export default withLayoutBasic(AgentsPage);
