import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import MainHeader from "../headers/MainHeader";
import Footer from "../Footer";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    return (
      <>
        <Head>
          <title>Petora</title>
          <meta name={"title"} content={`Petora`} />
        </Head>
        <Stack id="pc-wrap">
          <Stack id={"top"}>
            <Top />
          </Stack>

          <Stack id="main-top">
            <MainHeader />
          </Stack>

          <Stack id={"main"}>
            <Component {...props} />
          </Stack>

          <Stack id={"footer"}>
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutMain;
