import { Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import ServiceHeader from "../headers/ServiceHeader";
import AgentsHeader from "../headers/AgentsHeader";
import ShopHeader from "../headers/ShopHeader";
import CommunityHeader from "../headers/CommunityHeader";
import MyPageHeader from "../headers/MyPageHeader";
import CsHeader from "../headers/CsHeader";
import Top from "../Top";
import Footer from "../Footer";
import ContactUs from "../ContactUs";
import BackToTop from "../common/BackToTop";
import Chat from "../Chat";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const router = useRouter();

    const header = () => {
      switch (router.pathname) {
        case "/service":
          return (
            <Stack id={"main-top"}>
              <ServiceHeader />
            </Stack>
          );
        case "/agents":
          return (
            <Stack id={"agents-top"}>
              <AgentsHeader />
            </Stack>
          );
        case "/shop":
          return (
            <Stack id={"shop-top"}>
              <ShopHeader />
            </Stack>
          );
        case "/community":
          return (
            <Stack id={"community-top"}>
              <CommunityHeader />
            </Stack>
          );
        case "/mypage":
          return (
            <Stack id={"mypage-top"}>
              <MyPageHeader />
            </Stack>
          );
        case "/cs":
          return (
            <Stack id={"cs-top"}>
              <CsHeader />
            </Stack>
          );
      }
    };

    return (
      <>
        <Head>
          <title>Petora</title>
        </Head>
        <Stack id={device === "mobile" ? "mobile-wrap" : "pc-wrap"}>
          <Stack id={"top"}>
            <Top />
          </Stack>

          {header()}

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
  };
};

export default withLayoutBasic;
