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

const withLayoutBasic = (Component: any) => {
  const header = () => {
    const router = useRouter();
    switch (router.pathname) {
      case "/service":
        return <ServiceHeader />;
      case "/discovery":
        return <DiscoveryHeader />;
      case "/shop":
        return <ShopHeader />;
      case "/agents":
        return <AgentsHeader />;
      case "/community":
        return <CommunityHeader />;
      case "/mypage":
        return <MyPageHeader />;
      case "/cs":
        return <CsHeader />;
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

          <Stack id="main-top">{header()}</Stack>

          <Stack id={"main"}>
            <Component {...props} />
          </Stack>

          <Stack sx={{ background: "#a1887f" }}>Footer</Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
