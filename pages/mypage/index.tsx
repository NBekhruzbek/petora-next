import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { Container } from "@mui/material";
import { NextPage } from "next";

const MyPage: NextPage = () => {
  return <Container>My Page</Container>;
};

export default withLayoutBasic(MyPage);
