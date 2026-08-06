import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import MainHeader from "../headers/MainHeader";
import Footer from "../Footer";
import ContactUs from "../ContactUs";
import BackToTop from "../common/BackToTop";
import Chat from "../Chat";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();

    if (device === "mobile") {
      return (
        <>
          <Head>
            <title>Petora</title>
            <meta name={"title"} content={`Petora`} />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>

            <Stack id="main-top">
              <MainHeader />
            </Stack>

            <Stack id={"main"}>
              <Component {...props} />
            </Stack>

            <Stack id={"contact-us"}>
              <ContactUs />
            </Stack>

            <Stack id={"footer"}>
              <Footer />
            </Stack>

            <BackToTop />
            <Chat />
          </Stack>
        </>
      );
    } else {
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

            <Stack id={"contact-us"}>
              <ContactUs />
            </Stack>

            <Stack id={"footer"}>
              <Footer />
            </Stack>

            <BackToTop />
            <Chat />
          </Stack>
        </>
      );
    }
  };
};

export default withLayoutMain;
