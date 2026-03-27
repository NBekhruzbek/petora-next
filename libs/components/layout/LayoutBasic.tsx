import { Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import ServiceHeader from "../headers/ServiceHeader";
import DiscoveryHeader from "../headers/DiscoveryHeader";
import ShopHeader from "../headers/ShopHeader";
import AgentsHeader from "../headers/AgentsHeader";
import CommunityHeader from "../headers/CommunityHeader";
import MyPageHeader from "../headers/MyPageHeader";
import CsHeader from "../headers/CsHeader";
import Top from "../Top";
import Footer from "../Footer";
import ContactUs from "../ContactUs";

const withLayoutBasic = (Component: any) => {
  const header = () => {
    const router = useRouter();
    switch (router.pathname) {
      case "/service":
        return (
          <Stack id={"main-top"}>
            <ServiceHeader />
          </Stack>
        );
      case "/discovery":
        return (
          <Stack id={"discovery-top"}>
            <DiscoveryHeader />
          </Stack>
        );
      case "/shop":
        return (
          <Stack id={"shop-top"}>
            <ShopHeader />
          </Stack>
        );
      case "/agents":
        return (
          <Stack id={"agents-top"}>
            <AgentsHeader />
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
  return (props: any) => {
    return (
      <>
        <Head>
          <title>Petora</title>
        </Head>
        <Stack id="pc-wrap">
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
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
