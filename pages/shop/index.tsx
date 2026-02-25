import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Container } from "@mui/material";
import { NextPage } from "next";

const ShopList: NextPage = () => {
  console.log("SHOP COMPONENT - PAGES ROUTER");
  return <Container>SHOP LIST</Container>;
};

export default withLayoutBasic(ShopList);
